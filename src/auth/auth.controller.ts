import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import TokenController from '../token/token.controller';
import UserService from '../user/user.service';
import ErrorMessages from '../utils/helpers/errorMessages';
import messages from '../utils/helpers/messages';
import AuthService from './auth.service';

export default class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private tokenController: TokenController
  ) {
    this.authService = new AuthService();
    this.userService = new UserService();
    this.tokenController = new TokenController(this.userService);
  }

  public sendNotificationSettings = async (req: Request, res: Response) => {
    try {
      const clientId = req.query;
      const user = await this.userService.getUser(clientId);
      const { authorization } = req.headers;
      const token = authorization.split(' ')[1];

      const userData = await this.tokenController.validateAccessToken(token, res);

      if (!user) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.USER_DOESNT_EXIST });
      } else if (!userData) {
        res.status(StatusCodes.UNAUTHORIZED).json({ msg: messages.USER_NOT_AUTHORIZED });
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
