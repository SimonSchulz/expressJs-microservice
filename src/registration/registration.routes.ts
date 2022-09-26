import { Router } from 'express';
import { requestValidationMiddleware } from '../utils/helpers/validation';
import UserService from '../user/user.service';
import RegistrationController from './registration.controller';
import RegistrationService from './registration.service';

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
    this.router.get('/registration', requestValidationMiddleware, this.registrationController.checkPhoneStatus);
    this.router.get(
      '/registration/security-questions',
      requestValidationMiddleware,
      this.registrationController.sendSecurityQuestions
    );
    this.router.patch(
      '/registration/user-profile',
      requestValidationMiddleware,
      this.registrationController.updateUserProfile
    );
  }
}
export default RegistrationRoutes;
