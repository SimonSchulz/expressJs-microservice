import { Router } from 'express';
import { requestValidationMiddleware } from '../utils/helpers/validation';
import UserService from '../user/user.service';
import AuthController from './auth.controller';
import AuthService from './auth.service';

class AuthRoutes {
  public router = Router();

  private authController: AuthController;

  private authService: AuthService;

  private userService: UserService;

  constructor() {
    this.authService = new AuthService();
    this.authController = new AuthController(this.authService, this.userService);
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get('/auth/user/settings/notifications/all', this.authController.sendNotificationSettings);
  }
}
export default AuthRoutes;
