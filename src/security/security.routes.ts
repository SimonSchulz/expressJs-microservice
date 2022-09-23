import { Router } from 'express';
import { checkVerificationCodeMiddleware, requestValidationMiddleware } from '../utils/helpers/validation';
import SecurityController from './security.controller';
import SecurityService from './security.service';
import UserService from '../user/user.service';

class SecurityRoutes {
  public router = Router();

  private securityController: SecurityController;

  private securityService: SecurityService;

  private userService: UserService;

  constructor() {
    this.securityService = new SecurityService();
    this.securityController = new SecurityController(this.securityService, this.userService);
    this.initRoutes();
  }

  private initRoutes() {
    this.router.post('/security/session/', requestValidationMiddleware, this.securityController.sendVerificationCode);
    this.router.post(
      '/security/session/verification/',
      checkVerificationCodeMiddleware,
      this.securityController.checkVerificationCode
    );
  }
}

export default SecurityRoutes;
