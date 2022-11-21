import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import UserService from '../user/user.service';
import RegistrationService from './registration.service';
import { ErrorMessages } from '../utils/helpers/errorMessages';
import { ClientStatus } from '../utils/helpers/ClientStatus';
import { plainToInstance } from 'class-transformer';
import UpdateUserProfileDto from './dto/updateData.dto';
import SecurityQuestionEntity from '../entities/security-question.entity';
import { getRepository } from 'typeorm';
import { error } from 'console';
import { messages } from '../utils/helpers/messages';
import { RegistrationDataDto } from './dto/registrationData.dto';
import { SecurityQuestionsTypes } from '../utils/helpers/securityQuestionsTypes';
import { SecurityQuestionsTypes } from '../utils/helpers/securityQuestionsTypes';

export default class RegistrationController {
  constructor(private registration: RegistrationService, private userService: UserService) {
    this.registration = new RegistrationService();
    this.userService = new UserService();
  }

  public checkEmailStatus = async (req: Request, res: Response) => {
    try {
      const mail = req.query.email;
      const objToFind = { email: mail };

      const user = await this.userService.getUser(objToFind);
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({ mail: objToFind.email, msg: ErrorMessages.NOT_FOUND });
      }

      switch (user.clientStatus) {
        case ClientStatus.ACTIVE:
        case ClientStatus.NOT_ACTIVE:
          return res.status(StatusCodes.OK).json({ mail: objToFind.email, clientStatus: ClientStatus.IS_CLIENT });
        case ClientStatus.NOT_REGISTER:
          return res
            .status(StatusCodes.OK)
            .json({ email: mail, clientStatus: user.clientStatus, clientId: user.clientId });

        default:
          return res.status(StatusCodes.BAD_REQUEST).json({ clientStatus: user.clientStatus });
      }
    } catch (error) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: ErrorMessages.ERROR });
    }
  };

  public updateUserProfile = async (req: Request, res: Response) => {
    try {
      const updateData = plainToInstance(UpdateUserProfileDto, req.body);
      const objToFind = { email: updateData.email };

      const user = await this.userService.getUser(objToFind);
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({ msg: ErrorMessages.NOT_FOUND });
      }
      if (user.clientStatus === ClientStatus.NOT_REGISTER) {
        const allCheck = await this.userService.checkAllParams(user, updateData);
        const errorMessage = await this.userService.handleError(allCheck);
        if (allCheck.checks) {
          updateData.password = allCheck.newPassword;
          updateData.securityQuestionAnswer = allCheck.secQuestAnswer;
          await this.userService.updateUserData(user.clientId, updateData);
          await this.userService.updateUserStatus(user.email);
          await this.userService.changeUserQuestionType(user.clientId, updateData);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.SUCCESS });
        } else {
          return res.status(StatusCodes.BAD_REQUEST).json({ msg: errorMessage });
        }
      }
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: user.clientStatus });
    } catch (error) {
      console.log(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
  };

  public createUserProfile = async (req: Request, res: Response) => {
    try {
      const registrationData = plainToInstance(RegistrationDataDto, req.body);
      const { email, securityQuestionId, securityQuestionType } = registrationData;
      const user = await this.userService.getUser({ email });

      if (user) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.USER_ALREADY_EXIST });
      }

      if (securityQuestionType === SecurityQuestionsTypes.PREDEFINED) {
        const isQuestionId = await this.userService.checkSecQuestionId(securityQuestionId);
        if (!isQuestionId) {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: ErrorMessages.INVALID_ID });
        }
      }

      const isUserVerified = await this.userService.checkUserVerification(registrationData);
      const { email, securityQuestionId, securityQuestionType } = registrationData;
      const user = await this.userService.getUser({ email });

      if (user) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.USER_ALREADY_EXIST });
      }

      if (securityQuestionType === SecurityQuestionsTypes.PREDEFINED) {
        const isQuestionId = await this.userService.checkSecQuestionId(securityQuestionId);
        if (!isQuestionId) {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: ErrorMessages.INVALID_ID });
        }
      }

      const isUserVerified = await this.userService.checkUserVerification(registrationData);

      if (isUserVerified) {
        await this.userService.createUser(registrationData);
        return res.status(StatusCodes.OK).json({ msg: messages.SUCCESS });
      } else {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: ErrorMessages.NOT_VERIFIED });
      }
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
  };


  public sendSecurityQuestions = async (req: Request, res: Response) => {
    try {
      const questions = await getRepository(SecurityQuestionEntity).find({
        order: {
          id: 'ASC',
          question: 'DESC',
        },
      });

      res.status(StatusCodes.OK).json({ questions: questions });
    } catch {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error });
    }
  };
}
