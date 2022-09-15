/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable no-console */
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import UserService from '../user/user.service';
import ClientVerifStatus from '../utils/helpers/ClientVerifStatus';
import timeDiffInMinutes from '../utils/helpers/timeDiff';
import SecurityService from './security.service';
import messages from '../utils/helpers/messages';

export default class SecurityController {
  constructor(private securityService: SecurityService, private userService: UserService) {
    this.securityService = new SecurityService();
    this.userService = new UserService();
  }

  public sendVerificationCode = async (req: Request, res: Response) => {
    try {
      const { receiver } = req.query;
      const user = await this.userService.getUser(String(receiver));
      const cooldownTime = await this.securityService.getCooldownTime(String(receiver));

      if (timeDiffInMinutes(cooldownTime.updatedAt) < +process.env.COOLDOWN_TIME) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({ msg: messages.COOLDOWN });
      }

      const codeExpiration = new Date(Date.now());

      if (!user) {
        return res.status(StatusCodes.CONFLICT).json({ msg: messages.USER_DOESNT_EXIST });
      }
      const id = await this.securityService.sendCode(String(receiver), codeExpiration);

      return res.status(StatusCodes.OK).json({ id });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
  };

  public checkVerificationCode = async (req: Request, res: Response) => {
    try {
      const { verificationCode, id } = req.body;
      const userVerifData = await this.securityService.getClientDataById(id);

      if (
        userVerifData.clientVerifStatus === ClientVerifStatus.BLOCKED &&
        timeDiffInMinutes(userVerifData.lastInvalidAttemptTime) < +process.env.USER_BLOCK_EXPIRATION
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: messages.CLIENT_STILL_BLOCKED });
      }

      const newClientData = {
        clientVerifStatus: ClientVerifStatus.ACTIVE,
      };
      await this.securityService.updateByClientId(id, newClientData);

      if (timeDiffInMinutes(userVerifData.codeExpiration) >= +process.env.CODE_EXPIRATION_TIME) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: messages.CODE_EXPIRED });
      }

      if (verificationCode !== userVerifData.verificationCode) {
        const triesLeft = +process.env.MAX_CODE_TRIES - userVerifData.invalidAttempts + 1;
        const now = new Date(Date.now());
        const blockedTime = await this.securityService.checkCode(id);
        const lastInvalidAttemptTimeObj = { lastInvalidAttemptTime: now };

        const newTriesClientData = {
          lastInvalidAttemptTime: lastInvalidAttemptTimeObj.lastInvalidAttemptTime,
        };

        await this.securityService.updateByClientId(id, newTriesClientData);

        if (triesLeft <= 0) {
          const newBlockClientData = {
            clientVerifStatus: ClientVerifStatus.BLOCKED,
            lastInvalidAttemptTime: lastInvalidAttemptTimeObj.lastInvalidAttemptTime,
            invalidAttempts: 5,
          };

          await this.securityService.updateByClientId(id, newBlockClientData);

          return res.status(StatusCodes.BAD_REQUEST).json({ msg: messages.CLIENT_BLOCKED_TRY_AFTER });
        }

        return res.status(StatusCodes.BAD_REQUEST).json({ msg: messages.CODE_IS_INVALID });
      }

      const newActiveClientData = {
        invalidAttempts: 0,
      };

      await this.securityService.updateByClientId(id, newActiveClientData);

      return res.status(StatusCodes.OK).json({ msg: messages.SUCCESS });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
  };
}
