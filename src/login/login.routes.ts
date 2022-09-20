import { Router } from 'express';
import { loginMiddleware } from '../utils/helpers/validation';
import LoginController from './login.controller';
import LoginService from './login.service';

class SecurityRoutes {
  public router = Router();

  private loginController: LoginController;

  private loginService: LoginService;

  constructor() {
    this.loginController = new LoginController(this.loginService);
    this.loginService = new LoginService();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.post('/login', loginMiddleware, this.loginController.login);
  }
}

export default SecurityRoutes;
