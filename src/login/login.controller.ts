/* eslint-disable no-console */
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import UserService from '../user/user.service';
import TokenController from '../token/token.controller';
import messages from '../utils/helpers/messages';
import { loginTypes } from '../utils/helpers/constants';

export default class LoginController {
  constructor(private userService: UserService, private tokenController: TokenController) {
    this.userService = new UserService();
    this.tokenController = new TokenController(this.userService);
  }

  public login = async (req: Request, res: Response) => {
    try {
      const { type, login, password } = req.body;

      const data =
        type === loginTypes.mobilePhone
          ? await this.userService.getUser({ mobilePhone: login })
          : await this.userService.getUser({ passportId: login });

      if (!data) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: messages.USER_DOESNT_EXIST });
      }

      const isValidPassword = bcrypt.compareSync(password, data.password);

      if (!isValidPassword) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: messages.PASSWORD_IS_INVALID });
      }

      const accessToken = await this.tokenController.generateAccessToken(data.clientId);
      const refreshToken = await this.tokenController.generateRefreshToken(data.clientId);

      this.tokenController.setToken(res, accessToken);

      await this.tokenController.saveToken(data.clientId, refreshToken);

      return res.status(StatusCodes.OK).json({ msg: `accessToken: ${accessToken}, refreshToken: ${refreshToken}` });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
  };

  public reLogin = async (req: Request, res: Response) => {
    try {
      const { authorization } = req.headers;

      const refreshToken = authorization.split(' ')[1];

      const tokenData = await this.tokenController.validateRefreshToken(refreshToken);

      if (!refreshToken || !tokenData) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ msg: messages.USER_NOT_AUTHORIZED });
      }

      const accessToken = await this.tokenController.generateAccessToken(tokenData.userId);
      this.tokenController.setToken(res, accessToken);

      return res.status(StatusCodes.OK).json({ msg: `accessToken: ${accessToken} ` });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
  };
}
