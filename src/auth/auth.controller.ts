import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import UserService from '../user/user.service';
import ErrorMessages from '../utils/helpers/errorMessages';
import AuthService from './auth.service';

export default class AuthController {
  constructor(private authService: AuthService, private userService: UserService) {
    this.authService = new AuthService();
    this.userService = new UserService();
  }

  public sendNotificationSettings = async (req: Request, res: Response) => {
    try {
      let clientId = req.query;
      let user = await this.userService.getUser(clientId);
      if (!user) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: ErrorMessages.NOT_FOUND });
      } else {
        let userSettings = {
          email: user.email,
          smsNotification: user.smsNotification,
          pushNotification: user.pushNotification,
          emailSubscription: user.emailSubscription,
        };
        res.status(StatusCodes.OK).json({ userSettings });
      }
    } catch {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: ErrorMessages.ERROR });
    }
  };
}
