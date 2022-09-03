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

      const smsCode = await this.securityService.sendSms(String(receiver));

      const { id } = await this.securityService.getId(receiver);

      return res.status(StatusCodes.OK).json({ id, smsCode });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
  };
}
