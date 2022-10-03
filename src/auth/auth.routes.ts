import { Router } from 'express';
import { requestValidationMiddleware } from '../utils/helpers/validation';
import UserService from '../user/user.service';
import AuthController from './auth.controller';
import AuthService from './auth.service';
import TokenController from '../token/token.controller';

class AuthRoutes {
  public router = Router();

  private authController: AuthController;

  private authService: AuthService;

  private userService: UserService;

  private tokenController: TokenController;

  constructor() {
    this.authService = new AuthService();
    this.userService = new UserService();
    this.tokenController = new TokenController(this.userService);
    this.authController = new AuthController(this.authService, this.userService, this.tokenController);
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get('/auth/user/settings/notifications/all', this.authController.sendNotificationSettings);
  }
}
export default AuthRoutes;
