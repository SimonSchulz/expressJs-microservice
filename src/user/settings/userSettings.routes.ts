import { Router } from 'express';
import TokenController from '../../token/token.controller';
import { requestValidationMiddleware, sequrityQuestionMiddleware } from '../../middlewares/validation';
import checkAccessToken from '../../utils/tokenMiddleware';
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
    this.router.post(
      '/auth/user/settings/security-question',
      requestValidationMiddleware,
      checkAccessToken,
      sequrityQuestionMiddleware,
      this.userSettingsController.checkSecurityQuestion
    );
    this.router.post(
      '/auth/user/settings/new-password',
      requestValidationMiddleware,
      checkAccessToken,
      sequrityQuestionMiddleware,
      this.userSettingsController.checkUserPasswords
    );
    this.router.post(
      '/auth/user/settings/new-security-question',
      requestValidationMiddleware,
      checkAccessToken,
      sequrityQuestionMiddleware,
      this.userSettingsController.checkUserSecurityQuestions
    );
    this.router.patch(
      '/auth/user/settings/password',
      requestValidationMiddleware,
      checkAccessToken,
      sequrityQuestionMiddleware,
      this.userSettingsController.changeUserPassword
    );
    this.router.patch(
      '/auth/user/settings/security-question',
      requestValidationMiddleware,
      checkAccessToken,
      sequrityQuestionMiddleware,
      this.userSettingsController.changeUserSecurityQuestion
    );
    this.router.patch(
      '/auth/user/settings/contacts',
      requestValidationMiddleware,
      checkAccessToken,
      sequrityQuestionMiddleware,
      this.userSettingsController.changeUserContacts
    );
  }
}

export default UserSettingsRoutes;
