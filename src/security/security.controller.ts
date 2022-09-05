/* eslint-disable no-console */
/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import SecurityService from './security.service';

export default class SecurityController {
  constructor(private securityService: SecurityService) {}

  public sendVerificationCode = async (req: Request, res: Response) => {
    try {
      const { receiver } = req.query;
      const user = await this.securityService.getUser(String(receiver));

      if (!user) {
        return res.status(StatusCodes.CONFLICT).json({ msg: "User with this phone number doesn't exist" });
      }

      const id = await this.securityService.sendCode(String(receiver));

      return res.status(StatusCodes.OK).json({ id });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
  };
}
