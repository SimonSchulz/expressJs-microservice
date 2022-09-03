/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable no-console */
import { IRouter, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import SecurityService from './security.service';

export default class SecurityController {
  constructor(private securityService: SecurityService) {
    console.log(this);
  }

  public sendVerificationCode = async (req: Request, res: Response) => {
    try {
      console.log(this);

      const { receiver } = req.query;
      const user = await this.securityService.getUser(String(receiver));

      console.log(user);

      if (!user) {
        return res.status(StatusCodes.CONFLICT).json({ msg: "User with this phone number doesn't exist" });
      }

      const id = await this.securityService.sendSms;

      return res.status(StatusCodes.OK).json({ id });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
  };
}
