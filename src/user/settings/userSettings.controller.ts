import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import TokenController from '../../token/token.controller';
import { messages } from '../../utils/helpers/messages';
import { TypedRequestBody } from '../../utils/tokenMiddleware';
import UserService from '../user.service';
import ChangeUserSettingsDto from './dto/userSettings.dto';

class UserSettingsController {
  constructor(private userService: UserService, private tokenController: TokenController) {
    this.userService = new UserService();
    this.tokenController = new TokenController(this.userService);
  }

  public getSecQuestion = async (req: TypedRequestBody, res: Response) => {
    const clientId = req.userDecodedData.userId;
    const user = await this.userService.getUser({ clientId });
    return res.status(StatusCodes.OK).json({
      securityQuestion: user.securityQuestion,
      seqQuestionValidAttempts: user.secQuestionValidAttempts,
    });
  };

  public checkUserPasswords = async (req: Request, res: Response) => {
    const updateData = req.body;
    const user = await this.userService.getUser(updateData.clientId);

    const passCheck = await this.userService.checkUserPassword(user, updateData.password);
    const newPassCheck = await this.userService.checkUserPassword(user, updateData.newPassword);

    if (passCheck && !newPassCheck) {
      return res.status(StatusCodes.OK).json({ msg: messages.SUCCESS });
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.INVALID_PASSWORD });
    }
  };

  public checkUserSecurityQuestions = async (req: Request, res: Response) => {
    const updateData = req.body;
    const user = await this.userService.getUser(updateData.clientId);
    const secQuestionCheck = await this.userService.checkSecurityQuestionAnswer(
      user.securityQuestionAnswer,
      updateData.securityQuestionAnswer
    );
    const newSecQuestionCheck = await this.userService.checkSecurityQuestionAnswer(
      user.securityQuestionAnswer,
      updateData.newSecurityQuestionAnswer
    );

    if (secQuestionCheck && !newSecQuestionCheck) {
      return res.status(StatusCodes.OK).json({ msg: messages.SUCCESS });
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.INVALID_SECURITY_DATA });
    }
  };

  public checkSecurityQuestion = async (req: TypedRequestBody, res: Response) => {
    const { securityQuestionAnswer } = req.body;
    const errorMessages = [];
    const clientId = req.userDecodedData.userId;
    const user = await this.userService.getUser(clientId);
    const securityQuestionCheck = await this.userService.checkSecurityQuestionAnswer(
      user.securityQuestionAnswer,
      securityQuestionAnswer
    );

    if (user.isBlocked) {
      return res.status(StatusCodes.FORBIDDEN).json({ msg: messages.CLIENT_STILL_BLOCKED });
    }

    if (!securityQuestionCheck) {
      if (user.secQuestionValidAttempts > 0) {
        await this.userService.updateUserData(clientId, {
          secQuestionValidAttempts: user.secQuestionValidAttempts - 1,
          lastSecQuestionInvalidAttemptTime: new Date(),
        });
        errorMessages.push(
          `Left ${user.secQuestionValidAttempts - 1} ${
            user.secQuestionValidAttempts - 1 === 1 ? 'attempt' : 'attempts'
          }`
        );
      }
      if (user.secQuestionValidAttempts === 1 && !user.isBlocked) {
        await this.userService.updateUserData(clientId, { isBlocked: true });
        errorMessages.push(messages.CLIENT_BLOCKED_SECURITY_QUESTION);
      }
      errorMessages.push(messages.INVALID_SECURITY_DATA);
    }

    if (errorMessages.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errorMessages: errorMessages });
    } else {
      try {
        await this.userService.updateUserData(clientId, {
          secQuestionValidAttempts: +process.env.MAX_SECURITY_QUESTIONS_TRIES,
        });
        return res.status(StatusCodes.OK).json({ msg: messages.SUCCESS });
      } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.ERROR });
      }
    }
  };

  public changeUserPassword = async (req: Request, res: Response) => {
    const { clientId, password } = req.body;
    const hashPassword = await this.userService.genHashPassword(password);
    await this.changeUserData(req, res, { clientId, password: hashPassword });
  };

  public changeUserSecurityQuestion = async (req: Request, res: Response) => {
    const { clientId, securityQuestionAnswer } = req.body;
    const hashSecurityQuestionAnswer = await this.userService.genHashPassword(securityQuestionAnswer);
    await this.changeUserData(req, res, { clientId, securityQuestionAnswer: hashSecurityQuestionAnswer });
  };

  public changeUserEmail = async (req: Request, res: Response) => {
    const { clientId, email } = req.body;
    await this.changeUserData(req, res, { clientId, email });
  };

  public changeUserPhone = async (req: Request, res: Response) => {
    const { clientId, mobilePhone } = req.body;
    await this.changeUserData(req, res, { clientId, mobilePhone });
  };

  private changeUserData = async (req: Request, res: Response, user: ChangeUserSettingsDto) => {
    try {
      await this.userService.updateUserData(user.clientId, user);
      return res.status(StatusCodes.OK).json({ msg: messages.SUCCESS });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.ERROR });
    }
  };
}

export default UserSettingsController;
