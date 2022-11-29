import { plainToInstance } from 'class-transformer';
import e, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import UserService from '../user/user.service';
import { ClientVerifStatus } from '../utils/helpers/ClientVerifStatus';
import { timeDiffInMinutes } from '../utils/helpers/timeDiff';
import SecurityService from './security.service';
import { messages } from '../utils/helpers/messages';
import generateTime from '../utils/helpers/generateTime';
import { EmailDto } from '../registration/dto/email.dto';
import { PassportIdDto } from '../registration/dto/passportId.dto';
import { ClientStatus } from '../utils/helpers/ClientStatus';

export default class SecurityController {
  constructor(private securityService: SecurityService, private userService: UserService) {
    this.securityService = new SecurityService();
    this.userService = new UserService();
  }

  public updatePassword = async (req: Request, res: Response) => {
    try {
      const { id, newPassword } = req.body;
      const verifData = await this.securityService.getVerifDataByParam({ id });

      if (!verifData) return res.status(StatusCodes.NOT_FOUND);
      if (verifData.clientVerifStatus === ClientVerifStatus.BLOCKED) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({ msg: messages.CLIENT_STILL_BLOCKED });
      }
      const email = verifData.email;
      const newPasswordClientData = {
        password: newPassword,
      };

      await this.securityService.removeVerifRecord({ id });

      await this.securityService.updateUserByParam({ email }, newPasswordClientData);

      return res.status(StatusCodes.OK).json({ msg: messages.SUCCESS });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.INTERNAL_SERVER_ERROR });
    }
  }

  public sendVerificationCodeUpdatePassword = async (req: Request, res: Response) => {
    try {
      const { passportId } = plainToInstance(PassportIdDto, req.body);
      const user = await this.userService.getUser({ passportId });
      if(user && user.clientStatus === ClientStatus.REGISTERED) {
        const email = user.email;
        const verificationData = await this.securityService.getVerifDataByParam({ email });
        if (!verificationData) {
          const timeObj = generateTime();
          const data = await this.securityService.sendCode(
            email,
            timeObj.codeExpirationTime,
            timeObj.lastSentEmailTime
          );
          const { id } = data;

          return res.status(StatusCodes.OK).json({ id });
        } else {
          if (timeDiffInMinutes(verificationData.lastSentEmailTime) < +process.env.COOLDOWN_TIME) {
            const blockSecondsLeft = Math.round(
              60 - (new Date().getTime() - verificationData.lastSentEmailTime.getTime()) / 1000
            );
  
            return res.status(StatusCodes.NOT_ACCEPTABLE).json({ blockSeconds: blockSecondsLeft, msg: messages.COOLDOWN });
          }
  
          const timeObj = generateTime();
          const data = await this.securityService.sendCode(
            email,
            timeObj.codeExpirationTime,
            timeObj.lastSentEmailTime
          );

          return res.status(StatusCodes.OK).json({ id: data.id, email: data.email });
        }
      } else {
        return res.status(StatusCodes.CONFLICT).json({ msg: messages.USER_NOT_FOUND });
      }
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.INTERNAL_SERVER_ERROR });
    }
  }
 
  public sendVerificationCode = async (req: Request, res: Response) => {
    try {
      const { email } = plainToInstance(EmailDto, req.body);
      const user = await this.userService.getUser({ email });

      const verificationData = await this.securityService.getVerifDataByParam({ email });

      if(user && user.clientStatus !== ClientStatus.NOT_REGISTERED) {
        return res.status(StatusCodes.CONFLICT).json({ msg: messages.USER_ALREADY_EXIST });
      }
      
      if (!verificationData) {
        const timeObj = generateTime();
        const data = await this.securityService.sendCode(
          email,
          timeObj.codeExpirationTime,
          timeObj.lastSentEmailTime
        );
        const { id } = data;

        return res.status(StatusCodes.OK).json({ id });
      } else {
        if (timeDiffInMinutes(verificationData.lastSentEmailTime) < +process.env.COOLDOWN_TIME) {
          const blockSecondsLeft = Math.round(
            60 - (new Date().getTime() - verificationData.lastSentEmailTime.getTime()) / 1000
          );

          return res.status(StatusCodes.NOT_ACCEPTABLE).json({ blockSeconds: blockSecondsLeft, msg: messages.COOLDOWN });
        }

        const timeObj = generateTime();
        const data = await this.securityService.sendCode(
          email,
          timeObj.codeExpirationTime,
          timeObj.lastSentEmailTime
        );
        const { id } = data;
        return res.status(StatusCodes.OK).json({ id });
      }
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.INTERNAL_SERVER_ERROR });
    }
  };

  public checkVerificationCode = async (req: Request, res: Response) => {
    try {
      const { id, verificationCode } = req.body;

      const verifData = await this.securityService.getVerifDataByParam({ id });

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
