import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import UserService from '../user/user.service';
import LoginService from './login.service';
import TokenController from '../token/token.controller';

export default class LoginController {
  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private tokenController: TokenController
  ) {
    this.loginService = new LoginService();
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
        return res.send(StatusCodes.BAD_REQUEST).json({ msg: 'Client with this passport number does not exist' });
      }

      const validPassword = bcrypt.compareSync(password, data.password);

      if (!validPassword) {
        return res.send(StatusCodes.BAD_REQUEST).json({ msg: 'Password is invalid' });
      }

      const token = this.tokenController.generateTokens(data.clientId);

      return res.send(StatusCodes.OK).json({ msg: `accessToken: ${token}` });
    } catch (error) {
      return res.send(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
  }
}
