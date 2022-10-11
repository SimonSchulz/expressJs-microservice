import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import UserService from '../user/user.service';
import RegistrationService from './registration.service';
import ErrorMessages from '../utils/helpers/errorMessages';
import ClientStatus from '../utils/helpers/ClientStatus';
import { plainToInstance } from 'class-transformer';
import UpdateUserProfileDto from './dto/updateData.dto';
import SecurityQuestionEntity from '../entities/seqQuests.entity';
import { getRepository } from 'typeorm';
import { error } from 'console';
import messages from '../utils/helpers/messages';
import { RegistrationDataDto } from './dto/registrationData.dto';

export default class SecurityController {
  constructor(private registration: RegistrationService, private userService: UserService) {
    this.registration = new RegistrationService();
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
          return res.status(StatusCodes.BAD_REQUEST).json({ clientStatus: user.clientStatus });
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
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({ msg: ErrorMessages.NOT_FOUND });
      }
      if (user.clientStatus === ClientStatus.ACTIVE || user.clientStatus === ClientStatus.IS_CLIENT) {
        let allCheck = await this.userService.checkAllParams(user, updateData);
        let errorMessage = await this.userService.handleError(allCheck);

        if (allCheck.checks) {
          updateData.password = allCheck.newPassword;
          await this.userService.updateUserData(user.clientId, updateData);
          await this.userService.changeUserQuestionType(user.clientId, updateData);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.SUCCESS });
        } else {
          return res.status(StatusCodes.BAD_REQUEST).json({ msg: errorMessage });
        }
      }
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: user.clientStatus });
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

  public createUserProfile = async (req: Request, res: Response) => {
    try {
      const registrationData = plainToInstance(RegistrationDataDto, req.body);

      const createUser = await this.userService.createUser(registrationData);
      if (createUser) return res.status(StatusCodes.OK).json({ msg: messages.SUCCESS });
      else return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.USER_DOESNT_EXIST });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
  };
}
