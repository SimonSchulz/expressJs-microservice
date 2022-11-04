import { Router } from 'express';
import { requestValidationMiddleware } from '../utils/helpers/validation';
import RegistrationController from './registration.controller';
import RegistrationService from './registration.service';
import UserService from '../user/user.service';

class RegistrationRoutes {
  public router = Router();

  private registrationController: RegistrationController;

  private registrationService: RegistrationService;

  private userService: UserService;

  constructor() {
    this.registrationService = new RegistrationService();
    this.registrationController = new RegistrationController(this.registrationService, this.userService);
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get('/registration', requestValidationMiddleware, this.registrationController.checkEmailStatus);
    this.router.get(
      '/registration/security-questions',
      requestValidationMiddleware,
      this.registrationController.sendSecurityQuestions
    );
    this.router.patch(
      '/registration/user-profile',
      requestValidationMiddleware,

      requestValidationMiddleware,
      this.registrationController.updateUserProfile
    );
    this.router.post(
      '/registration/user-profile/new',
      requestValidationMiddleware,
      this.registrationController.createUserProfileNonClient
    );
  }
}
export default RegistrationRoutes;
