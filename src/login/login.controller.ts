import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import UserService from '../user/user.service';
import TokenController from '../token/token.controller';
import { loginTypes } from '../utils/helpers/constants';
// import { plainToClass } from 'class-transformer';
// import { UpdateUserPasswordDto } from './dto/UpdateUserPassword.dto';
// import { ErrorMessages } from '../utils/helpers/errorMessages';
// import { ClientStatus } from '../utils/helpers/ClientStatus';
import { messages } from '../utils/helpers/messages';

export default class LoginController {
  constructor(private userService: UserService, private tokenController: TokenController) {
    this.userService = new UserService();
    this.tokenController = new TokenController(this.userService);
  }
  // public updateUserPassword = async (req: Request, res: Response) => {
  //   try {
  //     let { mobilePhone, newPassword } = plainToClass(UpdateUserPasswordDto, req.body);
  //     const user = await this.userService.getUser({ mobilePhone });
  //     if (!user) {
  //       res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: ErrorMessages.NOT_FOUND });
  //     }
  //     if (user.clientStatus === ClientStatus.ACTIVE || user.clientStatus === ClientStatus.IS_CLIENT) {
  //       const checkNewPassword = await bcrypt.compareSync(newPassword, user.password);

  //       if (checkNewPassword) {
  //         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.SAME_PASSWORD });
  //       } else {
  //         newPassword = await this.userService.genHashPassword(newPassword);
  //         await this.userService.updateUserData(user.clientId, { password: newPassword });
  //         res.status(StatusCodes.OK).json({ msg: messages.SUCCESS });
  //       }
  //     } else {
  //       res.status(StatusCodes.OK).json({ clientStatus: user.clientStatus });
  //     }
  //   } catch (err) {
  //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: ErrorMessages.NOT_FOUND });
  //   }
  // };

  public login = async (req: Request, res: Response) => {
    try {
      const { type, login, password } = req.body;

      const data =
        type === loginTypes.email
          ? await this.userService.getUser({ email: login.toLowerCase() })
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

      this.tokenController.setToken(res, refreshToken);
      await this.tokenController.saveToken(data.clientId, refreshToken);

      return res.status(StatusCodes.OK).json({ accessToken, refreshToken });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
  };

  public reLogin = async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.cookies;

      const tokenData = await this.tokenController.validateRefreshToken(refreshToken, res);

      if (!refreshToken || !tokenData) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ msg: messages.USER_NOT_AUTHORIZED });
      }

      const accessTokenNew = await this.tokenController.generateAccessToken(tokenData.userId);
      const refreshTokenNew = await this.tokenController.generateRefreshToken(tokenData.userId);

      this.tokenController.setToken(res, refreshTokenNew);
      await this.tokenController.saveToken(tokenData.userId, refreshTokenNew);

      return res.status(StatusCodes.OK).json({ accessToken: accessTokenNew, refreshToken: refreshTokenNew });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
  };

  public logout = async (req: Request, res: Response) => {
    try {
      const { clientId } = req.body;
      await this.tokenController.revokeRefreshToken(clientId);
      return res.status(StatusCodes.OK).json({ msg: messages.USER_LOGGED_OUT });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
  };
  
}
