import { plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import UserService from '../user/user.service';
import { ClientVerifStatus } from '../utils/helpers/ClientVerifStatus';
import { timeDiffInMinutes } from '../utils/helpers/timeDiff';
import SecurityService from './security.service';
import { messages } from '../utils/helpers/messages';
import generateTime from '../utils/helpers/generateTime';
import { MobilePhoneDto } from '../registration/dto/mobilePhone.dto';
import { getRepository } from 'typeorm';
import SecurityQuestion from '../entities/security-question.entity';
import { USERS } from '../utils/helpers/verif.creator';

export default class SecurityController {
  constructor(private securityService: SecurityService, private userService: UserService) {
    this.securityService = new SecurityService();
    this.userService = new UserService();
  }

  public sendVerificationCode = async (req: Request, res: Response) => {
    try {
      const { mobilePhone } = plainToInstance(MobilePhoneDto, req.body);
      const user = await this.userService.getUser({ mobilePhone });

      const clientData = await this.securityService.getClientDataByParam({ mobilePhone });

      if (!user) {
        return res.status(StatusCodes.CONFLICT).json({ msg: messages.USER_DOESNT_EXIST });
      }

      if (!clientData) {
        const timeObj = generateTime();

        const smsId = await this.securityService.sendCode(
          mobilePhone,
          timeObj.codeExpirationTime,
          timeObj.lastSentSmsTime
        );
        const blockSecondsLeft = Math.round(60 - (new Date().getTime() - timeObj.lastSentSmsTime.getTime()) / 1000);

        return res.status(StatusCodes.OK).json({ smsId, blockSeconds: blockSecondsLeft });
      } else {
        if (timeDiffInMinutes(clientData.lastSentSmsTime) < +process.env.COOLDOWN_TIME) {
          const blockSecondsLeft = Math.round(
            60 - (new Date().getTime() - clientData.lastSentSmsTime.getTime()) / 1000
          );

          return res.status(StatusCodes.NOT_ACCEPTABLE).json({ blockSeconds: blockSecondsLeft });
        }

        const timeObj = generateTime();

        const smsId = await this.securityService.sendCode(
          mobilePhone,
          timeObj.codeExpirationTime,
          timeObj.lastSentSmsTime
        );

        return res.status(StatusCodes.OK).json({ smsId });
      }
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.INTERNAL_SERVER_ERROR });
    }
  };

  public checkVerificationCode = async (req: Request, res: Response) => {
    try {
      const { id, verificationCode } = req.body;

      const verifData = await this.securityService.getClientDataByParam({ id });

      if (!verifData) return res.status(StatusCodes.NOT_FOUND);

      if (
        verifData.clientVerifStatus === ClientVerifStatus.BLOCKED &&
        timeDiffInMinutes(verifData.lastInvalidAttemptTime) < +process.env.USER_BLOCK_EXPIRATION
      ) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({ msg: messages.CLIENT_STILL_BLOCKED });
      }

      const newClientData = {
        clientVerifStatus: ClientVerifStatus.ACTIVE,
      };

      await this.securityService.updateByParam({ id }, newClientData);

      if (timeDiffInMinutes(verifData.codeExpiration) >= +process.env.CODE_EXPIRATION_TIME) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({ msg: messages.CODE_EXPIRED });
      }

      if (verificationCode !== verifData.verificationCode) {
        const triesLeft = +process.env.MAX_CODE_TRIES - verifData.invalidAttempts + 1;
        const now = new Date(Date.now());
        const lastInvalidAttemptTimeObj = { lastInvalidAttemptTime: now };

        const newTriesClientData = {
          lastInvalidAttemptTime: lastInvalidAttemptTimeObj.lastInvalidAttemptTime,
        };

        await this.securityService.updateByParam({ id }, newTriesClientData);

        if (triesLeft <= 0) {
          const newBlockClientData = {
            clientVerifStatus: ClientVerifStatus.BLOCKED,
            lastInvalidAttemptTime: lastInvalidAttemptTimeObj.lastInvalidAttemptTime,
            invalidAttempts: 0,
          };

          await this.securityService.updateByParam({ id }, newBlockClientData);

          return res.status(StatusCodes.NOT_ACCEPTABLE).json({ msg: messages.CLIENT_BLOCKED_TRY_AFTER });
        }

        return res.status(StatusCodes.BAD_REQUEST).json({ msg: messages.CODE_IS_INVALID });
      }

      const newActiveClientData = {
        invalidAttempts: 0,
      };

      await this.securityService.updateByParam({ id }, newActiveClientData);

      return res.status(StatusCodes.OK).json({ msg: messages.SUCCESS });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
  };
}
