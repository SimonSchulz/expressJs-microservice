import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Client from '../../entities/client.entity';
import TokenController from '../../token/token.controller';
import { messages } from '../../utils/helpers/messages';
import UserService from '../user.service';

class UserSettingsController {
  constructor(private userService: UserService, private tokenController: TokenController) {
    this.userService = new UserService();
    this.tokenController = new TokenController(this.userService);
  }

  public checkUserPasswords = async (req: Request, res: Response) => {
    const updateData = req.body;
    const user = await this.userService.getUser(updateData.clientId)

    const passCheck = await this.userService.checkUserPassword(user, updateData.password);
    const newHashPass = await this.userService.genHashPassword(updateData.newPassword);
    const newPassCheck = await this.userService.checkUserPassword(user, newHashPass);

    if (passCheck && !newPassCheck) {
      return res.status(StatusCodes.OK).json({ msg: messages.SUCCESS });
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.INVALID_PASSWORD });
    }
  };

  public checkSecurityQuestion = async (req: Request, res: Response) => {
    const data = req.body;
    const errorMessages = [];
    const user = await this.userService.getUser(data.clientId);
    const securityQuestionCheck = await this.userService.checkSecurityQuestionAnswer(user.securityQuestionAnswer, data.securityQuestionAnswer);
    const securityQuestionTypeCheck = await this.userService.checkSecQuestionData(data);

    if (!securityQuestionTypeCheck) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.SEC_QUIESTION_TYPE });
    }

    if(user.isBlocked) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.CLIENT_STILL_BLOCKED });
    }

    if (!securityQuestionCheck ){
      if (+user.securityQuestionAvailableAttempts > 0) {
        await this.userService.updateUserData(data.clientId, { 
          securityQuestionAttempts: +user.securityQuestionAvailableAttempts - 1,
          securityQuestionLastInvalidAttempt: new Date()
        });
        errorMessages.push(
          `Left ${+user.securityQuestionAvailableAttempts - 1} ${+user.securityQuestionAvailableAttempts - 1 === 1 ? 'attempt' : 'attempts'}`
          );
      }
      if (+user.securityQuestionAvailableAttempts === 1 && !user.isBlocked) {
        await this.userService.updateUserData(data.clientId, { isBlocked: true })
        errorMessages.push(messages.CLIENT_BLOCKED_SECURITY_QUESTION);
      }
      errorMessages.push(messages.INVALID_SECURITY_DATA);
    }

    if (errorMessages.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errorMessages: errorMessages });
    } else {
        try {
          await this.userService.updateUserData(data.clientId, { securityQuestionAttempts: process.env.MAX_SECURITY_QUESTIONS_TRIES });
          return res.status(StatusCodes.OK).json({ msg: messages.SUCCESS });
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.ERROR });
        }
    }
  };

  public changeUserPassword = async (req: Request, res: Response) => {
    const updateData = req.body;
    const user = await this.userService.getUser(updateData.clientId);
    
    if (updateData.password) {
      user.password = await this.userService.genHashPassword(updateData.password);
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.PASSWORD_IS_INVALID });
    }

    await this.changeUserData(req, res, user);
  }

  private changeUserData = async (req: Request, res: Response, user: Client) => {
    try {
        await this.userService.updateUserData(user.clientId, user);
        return res.status(StatusCodes.OK).json({ msg: messages.SUCCESS });
      } catch (error) {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.ERROR });
      }
    }
  }

export default UserSettingsController;
