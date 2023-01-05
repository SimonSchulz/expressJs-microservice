import e, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import TokenController from '../../token/token.controller';
import { messages } from '../../utils/helpers/messages';
import UserService from '../user.service';
import { ClientStatus } from '../../utils/helpers/ClientStatus';

class UserSettingsController {
  constructor(private userService: UserService, private tokenController: TokenController) {
    this.userService = new UserService();
    this.tokenController = new TokenController(this.userService);
  }

  public checkUserPasswords = async (req: Request, res: Response) => {
    const updateData = req.body;
    const user = await this.userService.getUser(updateData.clientId)

    if (!user) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.USER_NOT_FOUND });
    }

    const passCheck = await this.userService.checkUserPassword(user, updateData.password);
    const newHashPass = await this.userService.genHashPassword(updateData.newPassword);
    const newPassCheck = await this.userService.checkUserPassword(user, newHashPass);

    if (newPassCheck) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.SAME_PASSWORD });
    }
    if (passCheck && !newPassCheck) {
      return res.status(StatusCodes.OK).json({ msg: messages.SUCCESS });
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.ERROR });
    }
  };

  public checkSecurityQuestion = async (req: Request, res: Response) => {
    const updateData = req.body;
    const errorMessages = [];
    const securityQuestionCheck = await this.userService.checkSecQuestionData(updateData);
    const user = await this.userService.getUser(updateData.clientId);

    if (!user) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.USER_NOT_FOUND });
    }

   if (!securityQuestionCheck){
      if (+user.securityQuestionAttempts > 0) {
        await this.userService.updateUserData(updateData.clientId, { 
          securityQuestionAttempts: +user.securityQuestionAttempts - 1,
          securityQuestionLastInvalidAttempt: new Date()
        });
        errorMessages.push(
          `Left ${+user.securityQuestionAttempts - 1} ${+user.securityQuestionAttempts - 1 === 1 ? 'attempt' : 'attempts'}`
          );
      }
      if (+user.securityQuestionAttempts === 1 && user.clientStatus !== ClientStatus.BLOCKED) {
        await this.userService.updateUserData(updateData.clientId, { clientStatus: ClientStatus.BLOCKED })
        errorMessages.push(messages.CLIENT_BLOCKED_SECURITY_QUESTION);
      }
      errorMessages.push(messages.INVALID_SECURITY_DATA);
    }

    if (errorMessages.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errorMessages: errorMessages });
    } else {
        try {
          await this.userService.updateUserData(updateData.clientId, { securityQuestionAttempts: process.env.MAX_SECURITY_QUESTIONS_TRIES });
          return res.status(StatusCodes.OK).json({ msg: messages.SUCCESS });
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.ERROR });
        }
    }
  };

  public changeUserData = async (req: Request, res: Response) => {
    const updateData = req.body;
    const errorMessages = [];
    const user = await this.userService.getUser(updateData.clientId);

    if (updateData.password) {
      updateData.password = await this.userService.genHashPassword(updateData.password);
    }

    if (!user) {
      errorMessages.push(messages.USER_DOESNT_EXIST);
    } 

    if (errorMessages.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errorMessages: errorMessages });
    } else {
        try {
          await this.userService.updateUserData(updateData.clientId, updateData);
          return res.status(StatusCodes.OK).json({ msg: messages.SUCCESS });
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.ERROR });
        }
    }
  }
}



export default UserSettingsController;
