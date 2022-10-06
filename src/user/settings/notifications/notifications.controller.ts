import { Request, Response } from 'express';
import UserService from '../../user.service';
import TokenController from '../../../token/token.controller';
import { StatusCodes } from 'http-status-codes';
import messages from '../../../utils/helpers/messages';

class NotificationsController {
  constructor(private userService: UserService, private tokenController: TokenController) {
    this.userService = new UserService();
    this.tokenController = new TokenController(this.userService);
  }

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
