import { Router } from 'express';
import { requestValidationMiddleware } from '../../utils/helpers/validation';
import UserService from '../user.service';
import UserInformationController from './userInformation.controller';

class UserInformationRoutes {
  public router = Router();

  private userInformationController: UserInformationController;

  private userService: UserService;

  constructor() {
    this.userService = new UserService();
    this.userInformationController = new UserInformationController(this.userService);
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get('/auth/information', requestValidationMiddleware, this.userInformationController.sendUserData);
  }
}

export default UserInformationRoutes;
