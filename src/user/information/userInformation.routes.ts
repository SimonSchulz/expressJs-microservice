import { Router } from 'express';
import { fileValidator } from '../../middlewares/fileValidator';
import TokenController from '../../token/token.controller';
import { requestValidationMiddleware } from '../../middlewares/validation';
import checkAccessToken from '../../utils/tokenMiddleware';
import UserService from '../user.service';
import UserInformationController from './userInformation.controller';

class UserInformationRoutes {
  public router = Router();

  private userInformationController: UserInformationController;

  private userService: UserService;

  private tokenController: TokenController;

  constructor() {
    this.userService = new UserService();
    this.tokenController = new TokenController(this.userService);
    this.userInformationController = new UserInformationController(this.userService, this.tokenController);
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get(
      '/auth/information',
      requestValidationMiddleware,
      checkAccessToken,
      this.userInformationController.sendUserData
    );
    this.router.post('/auth/avatar', fileValidator, checkAccessToken, this.userInformationController.uploadAvatar);
    this.router.delete('/auth/avatar', checkAccessToken, this.userInformationController.deleteAvatar);
    this.router.get('/auth/avatar', checkAccessToken, this.userInformationController.getAvatar);
    this.router.get('/auth/notifications', checkAccessToken, this.userInformationController.getNotifications);
  }
}

export default UserInformationRoutes;
