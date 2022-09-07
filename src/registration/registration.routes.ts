import { Router } from 'express';
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
    this.router.get('/registration', this.registrationController.checkPhoneStatus);
  }
}

export default RegistrationRoutes;
