import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import UserService from '../user/user.service';
import RegistrationService from './registration.service';
import { ClientStatus } from '../utils/helpers/constants';
import { ErrorMessages } from '../utils/helpers/constants';
import { plainToClass } from 'class-transformer';
import UpdateUserProfileDto from './dto/updateData.dto';
import SecurityQuestionEntity from '../entities/seqQuests.entity';
import { getRepository } from 'typeorm';

export default class SecurityController {
  constructor(private securityService: RegistrationService, private userService: UserService) {
    this.securityService = new RegistrationService();
    this.userService = new UserService();
  }

  public checkPhoneStatus = async (req: Request, res: Response) => {
    try {
      const phoneNumber = req.query.mobilePhone;

      const user = await this.userService.getUser(String(phoneNumber));
      if (user) {
        const clientStatus = user.clientStatus;

        switch (clientStatus) {
          case ClientStatus.ACTIVE:
          case ClientStatus.NOT_ACTIVE:
            return res.status(StatusCodes.CONFLICT).json({ msg: ClientStatus.IS_CLIENT });

          case ClientStatus.NOT_REGISTER:
            return res
              .status(StatusCodes.OK)
              .json({ mobilePhone: phoneNumber, clientStatus: clientStatus, idCustomer: user.clientId });
        }
      } else return res.status(StatusCodes.OK).json({ mobilePhone: phoneNumber, msg: ErrorMessages.NOT_CLIENT });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
  };

  public updateUserProfile = async (req: Request, res: Response) => {
    try {
      const updateData = plainToClass(UpdateUserProfileDto, req.body);
      const phoneNumber = updateData.mobilePhone;

      const user = await this.userService.getUser(String(phoneNumber));

      if (!user) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: ErrorMessages.NOT_FOUND });

      switch (user.clientStatus) {
        case ClientStatus.ACTIVE:
        case ClientStatus.IS_CLIENT:
          this.userService.updateUser(user, updateData);
      }

      return res.status(StatusCodes.OK).json({ msg: ErrorMessages.SUCCESS });
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
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: ErrorMessages.ERROR });
    }
  };
}
