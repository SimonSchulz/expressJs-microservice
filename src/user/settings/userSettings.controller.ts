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
    const user = await this.userService.getUser(updateData.clientId);

    const passCheck = await this.userService.checkUserPassword(user, updateData.password);
    const newHashPass = await this.userService.genHashPassword(updateData.newPassword);
    const newPassCheck = await this.userService.checkUserPassword(user, newHashPass);

    if (passCheck && !newPassCheck) {
      return res.status(StatusCodes.OK).json({ msg: messages.SUCCESS });
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.INVALID_PASSWORD });
    }
  };

  public checkUserSecurityQuestions = async (req: Request, res: Response) => {
    const updateData = req.body;
    const user = await this.userService.getUser(updateData.clientId);
    const secQuestionCheck = await this.userService.checkSecurityQuestionAnswer(user.securityQuestionAnswer, updateData.securityQuestionAnswer);
    const newSecQuestionCheck = await this.userService.checkSecurityQuestionAnswer(user.securityQuestionAnswer, updateData.newSecurityQuestionAnswer);

    if (secQuestionCheck && !newSecQuestionCheck) {
      return res.status(StatusCodes.OK).json({ msg: messages.SUCCESS });
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.INVALID_SECURITY_DATA });
    }
  }

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
      if (user.secQuestionValidAttempts > 0) {
        await this.userService.updateUserData(data.clientId, { 
          secQuestionValidAttempts: user.secQuestionValidAttempts - 1,
          lastSecQuestionInvalidAttemptTime: new Date()
        });
        errorMessages.push(
          `Left ${user.secQuestionValidAttempts - 1} ${user.secQuestionValidAttempts - 1 === 1 ? 'attempt' : 'attempts'}`
          );
      }
      if (user.secQuestionValidAttempts === 1 && !user.isBlocked) {
        await this.userService.updateUserData(data.clientId, { isBlocked: true })
        errorMessages.push(messages.CLIENT_BLOCKED_SECURITY_QUESTION);
      }
      errorMessages.push(messages.INVALID_SECURITY_DATA);
    }

    if (errorMessages.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errorMessages: errorMessages });
    } else {
        try {
          await this.userService.updateUserData(data.clientId, { secQuestionValidAttempts: +process.env.MAX_SECURITY_QUESTIONS_TRIES });
          return res.status(StatusCodes.OK).json({ msg: messages.SUCCESS });
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.ERROR });
        }
    }
  };

  public changeUserPassword = async (req: Request, res: Response) => {
    const { clientId, password } = req.body;
    const user = await this.userService.getUser(clientId);
    
    if (password) {
      user.password = await this.userService.genHashPassword(password);
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.PASSWORD_IS_INVALID });
    }

    await this.changeUserData(req, res, user);
  }

  public changeUserSecurityQuestion = async (req: Request, res: Response) => {
    const { clientId, securityQuestionAnswer } = req.body;
    const user = await this.userService.getUser(clientId);

    if (securityQuestionAnswer) {
      user.securityQuestionAnswer = await this.userService.genHashPassword(securityQuestionAnswer);
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.INVALID_SECURITY_DATA });
    }

    await this.changeUserData(req, res, user);
  }

  public changeUserEmail = async (req: Request, res: Response) => {
    const { clientId, email } = req.body;
    const user = await this.userService.getUser(clientId);
    
    if (email) {
      user.email = email;
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.EMAIL_IS_INVALID });
    }

    await this.changeUserData(req, res, user);
  }

  public changeUserPhone = async (req: Request, res: Response) => {
    const { clientId, mobilePhone } = req.body;
    const user = await this.userService.getUser(clientId);
    
    if (mobilePhone) {
      user.mobilePhone = mobilePhone;
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.INVALID_MOBILE_PHONE });
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
