import e, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import UserService from '../user/user.service';
import RegistrationService from './registration.service';
import ErrorMessages from '../utils/helpers/errorMessages';
import ClientStatus from '../utils/helpers/ClientStatus';
import { plainToClass, plainToInstance } from 'class-transformer';
import UpdateUserProfileDto from './dto/updateData.dto';
import SecurityQuestionEntity from '../entities/seqQuests.entity';
import { getRepository } from 'typeorm';
import SecurityQuestionsTypes from '../utils/helpers/securityQuestionsTypes';
import { error } from 'console';

export default class SecurityController {
  constructor(private securityService: RegistrationService, private userService: UserService) {
    this.securityService = new RegistrationService();
    this.userService = new UserService();
  }

  public checkPhoneStatus = async (req: Request, res: Response) => {
    try {
      const phoneNumber = req.query.mobilePhone;
      const objToFind = { mobilePhone: phoneNumber };

      const user = await this.userService.getUser(objToFind);
      if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ mobilePhone: objToFind.mobilePhone, msg: ErrorMessages.NOT_FOUND });
      }

      switch (user.clientStatus) {
        case ClientStatus.ACTIVE:
        case ClientStatus.NOT_ACTIVE:
          return res
            .status(StatusCodes.OK)
            .json({ mobilePhone: objToFind.mobilePhone, clientStatus: ClientStatus.IS_CLIENT });

        case ClientStatus.NOT_REGISTER:
          return res
            .status(StatusCodes.OK)
            .json({ mobilePhone: phoneNumber, clientStatus: user.clientStatus, clientId: user.clientId });

        default:
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ clientStatus: user.clientStatus });
      }
    } catch (error) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: ErrorMessages.ERROR });
    }
  };

  public updateUserProfile = async (req: Request, res: Response) => {
    try {
      const updateData = plainToInstance(UpdateUserProfileDto, req.body);
      const objToFind = { mobilePhone: updateData.mobilePhone };

      const user = await this.userService.getUser(objToFind);
      if (user) {
        if (user.clientStatus === ClientStatus.ACTIVE || user.clientStatus === ClientStatus.IS_CLIENT) {
          let allCheck = await this.userService.checkAllParams(user, updateData);
          let errorMessage = await this.userService.handleError(allCheck);

          if (allCheck.checks) {
            updateData.password = allCheck.newPassword;
            this.userService.updateUser(user, updateData);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: ErrorMessages.SUCCESS });
          } else return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: errorMessage });
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: user.clientStatus });
      } else {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: ErrorMessages.NOT_FOUND });
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
