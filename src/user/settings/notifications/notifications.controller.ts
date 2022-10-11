import { Request, Response } from 'express';
import UserService from '../../user.service';
import TokenController from '../../../token/token.controller';
import { StatusCodes } from 'http-status-codes';
import messages from '../../../utils/helpers/messages';
import { CustomRepositoryCannotInheritRepositoryError } from 'typeorm';

class NotificationsController {
  constructor(private userService: UserService, private tokenController: TokenController) {
    this.userService = new UserService();
    this.tokenController = new TokenController(this.userService);
  }

  public sendNotificationSettings = async (req: Request, res: Response) => {
    try {
      const clientId = req.query;
      const user = await this.userService.getUser(clientId);

      if (!user) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.USER_DOESNT_EXIST });
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
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.ERROR });
    }
  };

  public patchSmsNotifications = async (req: Request, res: Response) => {
    try {
      const { clientId, smsNotification, pushNotification, emailSubscription } = req.body;
      const user = await this.userService.getUser({ clientId });

      if (!user) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: messages.USER_DOESNT_EXIST });
      }

      if (user.email === null) {
        await this.userService.updateUserData(clientId, {
          smsNotification: smsNotification,
          pushNotification: pushNotification,
        });
      } else {
        await this.userService.updateUserData(clientId, {
          smsNotification: smsNotification,
          pushNotification: pushNotification,
          emailSubscription: emailSubscription,
        });
      }
      return res.status(StatusCodes.OK).json({ msg: messages.SUCCESS });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.INTERNAL_SERVER_ERROR });
    }
  };
}

export default NotificationsController;
