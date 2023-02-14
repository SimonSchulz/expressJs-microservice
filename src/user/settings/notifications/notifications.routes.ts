import { requestValidationMiddleware } from '../../../middlewares/validation';
import { Router } from 'express';
import TokenController from '../../../token/token.controller';
import UserService from '../../user.service';
import NotificationsController from './notifications.controller';

class NotificationsRoutes {
  public router = Router();

  private notificationsController: NotificationsController;

  private userService: UserService;

  private tokenController: TokenController;

  constructor() {
    this.notificationsController = new NotificationsController(this.userService, this.tokenController);
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get(
      '/auth/user/settings/notifications/all/',
      requestValidationMiddleware,
      this.notificationsController.sendNotificationSettings
    );
    this.router.patch(
      '/auth/user/settings/notifications/',
      requestValidationMiddleware,
      this.notificationsController.patchSmsNotifications
    );
  }
}

export default NotificationsRoutes;
