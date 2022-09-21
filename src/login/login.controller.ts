import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import UserService from '../user/user.service';
import TokenController from '../token/token.controller';

export default class LoginController {
  constructor(private userService: UserService, private tokenController: TokenController) {
    this.userService = new UserService();
    this.tokenController = new TokenController(this.userService);
  }

  public async login(req: Request, res: Response) {
    try {
      const { type, login, password } = req.body;
      const passportObj = { passportId: login };
      const mobilePhoneObj = { mobilePhone: login };
      const data =
        type === 'PASSPORT_NUMBER'
          ? await this.userService.getUser(passportObj)
          : await this.userService.getUser(mobilePhoneObj);

      if (!data) {
        return res.send(StatusCodes.BAD_REQUEST).json({ msg: messages.USER_DOESNT_EXIST });
      }

      const validPassword = bcrypt.compareSync(password, data.password);

      if (!validPassword) {
        return res.send(StatusCodes.BAD_REQUEST).json({ msg: messages.PASSWORD_IS_INVALID });
      }

      const token = await this.tokenController.generateTokens(data.clientId);

      return res
        .send(StatusCodes.OK)
        .json({ msg: `accessToken: ${token.accessToken}, refreshToken: ${token.refreshToken}` });
    } catch (error) {
      return res.send(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
  }
}
