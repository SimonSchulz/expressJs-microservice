import { Router } from 'express';
import TokenController from '../../token/token.controller';
import { requestValidationMiddleware, sequrityQuestionMiddleware } from '../../utils/helpers/validation';
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
      '/auth/user/settings/security-question',
      sequrityQuestionMiddleware,
      requestValidationMiddleware,
      this.userSettingsController.checkSecurityQuestion
    );
    this.router.patch(
      '/auth/user/settings/new-password',
      sequrityQuestionMiddleware,
      requestValidationMiddleware,
      this.userSettingsController.checkUserPasswords
    );
    this.router.put(
      '/auth/user/settings/password',
      sequrityQuestionMiddleware,
      requestValidationMiddleware,
      this.userSettingsController.changeUserPassword
    );
  }
}

export default UserSettingsRoutes;
