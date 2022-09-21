import { Router } from 'express';
import { requestValidationMiddleware } from '../utils/helpers/validation';
import { phoneNumberValidator, registrationDataValidator, updateDataValidator } from './registration.validation';
import RegistrationController from './registration.controller';
import RegistrationService from './registration.service';

class RegistrationRoutes {
  public router = Router();

  private registrationController: RegistrationController;

  private registrationService: RegistrationService;

  constructor() {
    this.registrationService = new RegistrationService();
    this.registrationController = new RegistrationController(this.registrationService);
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get('/registration', requestValidationMiddleware, this.registrationController.checkPhoneStatus);
    this.router.patch(
      '/registration/user-profile',
      requestValidationMiddleware,
      this.registrationController.updateUserProfile
    );
    this.router.post(
      '/registration/user-profile/new',
      requestValidationMiddleware,
      this.registrationController.createUserProfile
    );
  }
}

export default RegistrationRoutes;
