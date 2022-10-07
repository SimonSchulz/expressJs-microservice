import { Router } from 'express';
import TokenController from '../../token/token.controller';
import { requestValidationMiddleware } from '../../utils/helpers/validation';
import UserService from '../user.service';
import UserSettingsController from './userSettings.controller';

class UserSettingsRoutes {
  public router = Router();

  private userSettingsController: UserSettingsController;

  private userService: UserService;

  private tokenController: TokenController;

  constructor() {
    this.userSettingsController = new UserSettingsController(this.userService, this.tokenController);
    this.initRoutes();
  }

  private initRoutes() {
    this.router.patch(
      '/auth/user/settings/all',
      requestValidationMiddleware,
      this.userSettingsController.changeUserSettings
    );
  }
}

export default UserSettingsRoutes;
