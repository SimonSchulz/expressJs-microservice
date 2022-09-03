/* eslint-disable no-console */
import { IRouter, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import SecurityService from './security.service';

class SecurityController {
  private securityService: SecurityService;

  constructor(private router: IRouter) {
    this.router = router;
    this.securityService = new SecurityService();
  }

  public async sendVerificationCode(req: Request, res: Response) {
    try {
      console.log(this.securityService);
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
  }
}

export default SecurityController;
