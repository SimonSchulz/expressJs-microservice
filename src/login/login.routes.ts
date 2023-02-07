import { Router } from 'express';
import { isBlocked } from '../middlewares/isBlocked';
import TokenController from '../token/token.controller';
import UserService from '../user/user.service';
import { requestValidationMiddleware } from '../middlewares/validation';
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
    this.router.post('/login', requestValidationMiddleware, isBlocked, this.loginController.login);
    this.router.get('/login/token', this.loginController.reLogin);
    //this.router.patch('/login/password', requestValidationMiddleware, this.loginController.updateUserPassword);
    this.router.get('/logout', this.loginController.logout)
  }
  
}

export default LoginRoutes;
