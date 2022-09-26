/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable no-console */
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import UserService from '../user/user.service';
import SecurityService from './security.service';

export default class SecurityController {
  constructor(private securityService: SecurityService, private userService: UserService) {
    this.securityService = new SecurityService();
    this.userService = new UserService();
  }

  public sendVerificationCode = async (req: Request, res: Response) => {
    try {
      const { mobilePhone } = req.query;

      const user = await this.userService.getUser({ mobilePhone: mobilePhone as string });

      if (!user) {
        return res.status(StatusCodes.CONFLICT).json({ msg: "User with this phone number doesn't exist" });
      }

      const id = await this.securityService.sendCode(String(mobilePhone));

      return res.status(StatusCodes.OK).json({ id });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
  };
}
