import { Response } from 'express';
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

  public getSecQuestions = async (req: TypedRequestBody, res: Response) => {
    const questions = await this.userService.getSecurityQuestions();
    return res.status(StatusCodes.OK).json({ questions });
  };

  public checkUserPasswords = async (req: TypedRequestBody, res: Response) => {
    const updateData = req.body;
    const clientId = req.userDecodedData.userId;
    const user = await this.userService.getUser(clientId);

    const passCheck = await this.userService.checkUserPassword(user, updateData.password);
    const newPassCheck = await this.userService.checkUserPassword(user, updateData.newPassword);

    if (passCheck && !newPassCheck) {
      return res.status(StatusCodes.OK).json({ msg: messages.SUCCESS });
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.INVALID_PASSWORD });
    }
  };

  public checkUserSecurityQuestions = async (req: TypedRequestBody, res: Response) => {
    const updateData = req.body;
    const clientId = req.userDecodedData.userId;
    const user = await this.userService.getUser(clientId);
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
    const data = req.body;
    const clientId = req.userDecodedData.userId;
    const errorMessages = [];
    const user = await this.userService.getUser(clientId);
    const securityQuestionCheck = await this.userService.checkSecurityQuestionAnswer(
      user.securityQuestionAnswer,
      data.securityQuestionAnswer
    );

    if (user.isBlocked) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: messages.CLIENT_STILL_BLOCKED, isBlocked: user.isBlocked });
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
        user.isBlocked = true;
        errorMessages.push(messages.CLIENT_BLOCKED_SECURITY_QUESTION);
      }
      errorMessages.push(messages.INVALID_SECURITY_DATA);
    }

    if (errorMessages.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        errorMessages: errorMessages,
        validAttempts: user.secQuestionValidAttempts - 1,
        isBlocked: user.isBlocked,
      });
    } else {
      try {
        await this.userService.updateUserData(clientId, {
          secQuestionValidAttempts: +process.env.MAX_SECURITY_QUESTIONS_TRIES,
        });
        return res.status(StatusCodes.OK).json({ msg: messages.SUCCESS });
      } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          msg: messages.ERROR,
        });
      }
    }
  };

  public changeUserPassword = async (req: TypedRequestBody, res: Response) => {
    const { password } = req.body;
    const clientId = req.userDecodedData.userId;
    const hashPassword = await this.userService.genHashPassword(password);
    await this.changeUserData(req, res, { clientId, password: hashPassword });
  };

  public changeUserSecurityQuestion = async (req: TypedRequestBody, res: Response) => {
    const updateData = req.body;
    const clientId = req.userDecodedData.userId;
    const hashSecurityQuestionAnswer = await this.userService.genHashPassword(updateData.securityQuestionAnswer);

    if (updateData.securityQuestionId && updateData.securityQuestion) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.INVALID_SECURITY_DATA });
    }
    if (updateData.securityQuestion && !updateData.securityQuestionId) {
      await this.changeUserData(req, res, {
        clientId,
        securityQuestionAnswer: hashSecurityQuestionAnswer,
        securityQuestion: updateData.securityQuestion,
        securityQuestionId: null,
        securityQuestionType: 'selfDefined',
      });
    } else {
      await this.changeUserData(req, res, {
        clientId,
        securityQuestionAnswer: hashSecurityQuestionAnswer,
        securityQuestionId: updateData.securityQuestionId,
        securityQuestion: null,
        securityQuestionType: 'preDefined',
      });
    }
  };

  public changeUserContacts = async (req: TypedRequestBody, res: Response) => {
    const { email, mobilePhone } = req.body;
    const clientId = req.userDecodedData.userId;
    const user = await this.userService.getUser({ clientId });
    const checkEmail = await this.userService.getUser({ email });
    const checkMobilePhone = await this.userService.getUser({ mobilePhone });

    if (checkEmail) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.EMAIL_IS_EXIST });
    }

    if (checkMobilePhone) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.MOBILE_PHONE_IS_EXIST });
    }

    await this.changeUserData(req, res, {
      clientId,
      email: email || user.email,
      mobilePhone: mobilePhone || user.mobilePhone,
    });
  };

  public deactivateUser = async (req: TypedRequestBody, res: Response) => {
    const clientId = req.userDecodedData.userId;
    await this.changeUserData(req, res, { clientId, isDeactivated: true });
  };

  private changeUserData = async (req: TypedRequestBody, res: Response, user: ChangeUserSettingsDto) => {
    try {
      await this.userService.updateUserData(user.clientId, user);
      return res.status(StatusCodes.OK).json({ msg: messages.SUCCESS });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.ERROR });
    }
  };
}

export default UserSettingsController;
