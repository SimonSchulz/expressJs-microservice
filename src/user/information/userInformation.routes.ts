import { Router } from 'express';
import TokenController from '../../token/token.controller';
import { requestValidationMiddleware } from '../../utils/helpers/validation';
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
  }
}

export default UserInformationRoutes;
