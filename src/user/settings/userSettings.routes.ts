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
      requestValidationMiddleware,
      sequrityQuestionMiddleware,
      this.userSettingsController.checkSecurityQuestion
    );
    this.router.patch(
      '/auth/user/settings/new-password',
      requestValidationMiddleware,
      sequrityQuestionMiddleware,
      this.userSettingsController.checkUserPasswords
    );
    this.router.patch(
      '/auth/user/settings/new-security-question',
      requestValidationMiddleware,
      sequrityQuestionMiddleware,
      this.userSettingsController.checkUserSecurityQuestions
    );
    this.router.put(
      '/auth/user/settings/password',
      requestValidationMiddleware,
      sequrityQuestionMiddleware,
      this.userSettingsController.changeUserPassword
    );
    this.router.put(
      '/auth/user/settings/security-question',
      requestValidationMiddleware,
      sequrityQuestionMiddleware,
      this.userSettingsController.changeUserSecurityQuestion
    );
    this.router.put(
      '/auth/user/settings/email',
      requestValidationMiddleware,
      sequrityQuestionMiddleware,
      this.userSettingsController.changeUserEmail
    );
    this.router.put(
      '/auth/user/settings/mobile-phone',
      requestValidationMiddleware,
      sequrityQuestionMiddleware,
      this.userSettingsController.changeUserPhone
    );
  }
}

export default UserSettingsRoutes;
