import { Router } from 'express';
import TokenController from '../token/token.controller';
import UserService from '../user/user.service';
import { requestValidationMiddleware } from '../utils/helpers/validation';
import LoginController from './login.controller';
import LoginService from './login.service';

class LoginRoutes {
  public router = Router();

  private loginController: LoginController;

  private loginService: LoginService;

  private userService: UserService;

  private tokenController: TokenController;

  constructor() {
    this.loginService = new LoginService();
    this.loginController = new LoginController(this.userService);

    this.initRoutes();
  }

  private initRoutes() {
    this.router.patch('/login/password', requestValidationMiddleware, this.loginController.updateUserPassword);
  }
}

export default LoginRoutes;
