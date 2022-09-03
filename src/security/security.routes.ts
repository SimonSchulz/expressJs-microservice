import { Router } from 'express';
import { requestValidationMiddleware } from '../utils/helpers/validation';
import SecurityController from './security.controller';
import SecurityService from './security.service';

class SecurityRoutes {
  public router = Router();

  private securityController: SecurityController;

  private securityService: SecurityService;

  constructor() {
    this.securityService = new SecurityService();
    this.securityController = new SecurityController(this.securityService);
    this.initRoutes();
  }

  private initRoutes() {
    this.router.post('/security/session/', requestValidationMiddleware, this.securityController.sendVerificationCode);
  }
}

export default SecurityRoutes;
