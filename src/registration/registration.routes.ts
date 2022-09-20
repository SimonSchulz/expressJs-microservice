import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { requestValidationMiddleware } from '../utils/helpers/validation';
import MobilePhoneDto from './dto/mobilePhone.dto';
import UpdateUserProfileDto from './dto/updateData.dto';
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
  }
}
export default RegistrationRoutes;
