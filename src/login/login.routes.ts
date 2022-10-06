import { Router } from 'express';
import TokenController from '../token/token.controller';
import UserService from '../user/user.service';
import LoginController from './login.controller';
import LoginService from './login.service';

class LoginRoutes {
  public router = Router();

  private loginController: LoginController;

  private loginService: LoginService;

  private userService: UserService;

  private tokenController: TokenController;

  constructor() {
    this.userService = new UserService();
    this.tokenController = new TokenController(this.userService);
    this.loginController = new LoginController(this.userService, this.tokenController);
    this.loginService = new LoginService();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.post('/login/', this.loginController.login);
    this.router.get('/login/token/', this.loginController.reLogin);
  }
}

export default LoginRoutes;
