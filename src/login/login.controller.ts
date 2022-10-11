/* eslint-disable no-console */
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import UserService from '../user/user.service';
import TokenController from '../token/token.controller';
import { loginTypes } from '../utils/helpers/constants';
import { plainToClass } from 'class-transformer';
import { UpdateUserPasswordDto } from './dto/UpdateUserPassword.dto';
import ErrorMessages from '../utils/helpers/errorMessages';
import ClientStatus from '../utils/helpers/ClientStatus';
import messages from '../utils/helpers/messages';

export default class LoginController {
  constructor(private userService: UserService, private tokenController: TokenController) {
    this.userService = new UserService();
    this.tokenController = new TokenController(this.userService);
  }
  public updateUserPassword = async (req: Request, res: Response) => {
    try {
      let { mobilePhone, newPassword } = plainToClass(UpdateUserPasswordDto, req.body);
      const user = await this.userService.getUser({ mobilePhone });
      if (!user) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: ErrorMessages.NOT_FOUND });
      }
      if (user.clientStatus === ClientStatus.ACTIVE || user.clientStatus === ClientStatus.IS_CLIENT) {
        const checkNewPassword = await bcrypt.compareSync(newPassword, user.password);

        if (checkNewPassword) {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.SAME_PASSWORD });
        } else {
          newPassword = await this.userService.genHashPassword(newPassword);
          await this.userService.updateUserData(user.clientId, { password: newPassword });
          res.status(StatusCodes.OK).json({ msg: messages.SUCCESS });
        }
      } else {
        res.status(StatusCodes.OK).json({ clientStatus: user.clientStatus });
      }
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: ErrorMessages.NOT_FOUND });
    }
  };

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

      const tokenData = await this.tokenController.validateRefreshToken(refreshToken, res);

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
