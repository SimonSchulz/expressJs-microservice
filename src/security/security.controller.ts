/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable no-console */
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import UserService from '../user/user.service';
import timeDiffInMinutes from '../utils/helpers/timeDiff';
import SecurityService from './security.service';

export default class SecurityController {
  constructor(private securityService: SecurityService, private userService: UserService) {
    this.securityService = new SecurityService();
    this.userService = new UserService();
  }

  public sendVerificationCode = async (req: Request, res: Response) => {
    try {
      const { receiver } = req.query;
      const user = await this.userService.getUser(String(receiver));
      const codeExpiration = new Date(Date.now());

      if (!user) {
        return res.status(StatusCodes.CONFLICT).json({ msg: "User with this phone number doesn't exist" });
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
      const user = await this.securityService.getUser(id);

      if (
        user.clientVerifStatus === 'blocked' &&
        timeDiffInMinutes(user.lastInvalidAttemptTime) < +process.env.USER_BLOCK_EXPIRATION
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'You still blocked, try again later' });
      }

      const newClientStatus = { clientVerifStatus: 'active' };
      await this.securityService.unblockUser(id, newClientStatus.clientVerifStatus);

      if (timeDiffInMinutes(user.codeExpiration) >= +process.env.CODE_EXPIRATION_TIME) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Verification code expired!' });
      }

      if (verificationCode !== user.verificationCode || id !== user.id) {
        const triesLeft = +process.env.MAX_CODE_TRIES - user.invalidAttempts + 1;
        const now = new Date(Date.now());
        const blockedTime = await this.securityService.checkCode(id);
        const lastInvalidAttemptTimeObj = { lastInvalidAttemptTime: now };

        await this.securityService.updateLastInvalidAttemptTime(id, lastInvalidAttemptTimeObj.lastInvalidAttemptTime);

        if (triesLeft <= 0) {
          const newClientStatusIfNoTriesLeft = { clientVerifStatus: 'blocked' };

          await this.securityService.blockUser(id, newClientStatusIfNoTriesLeft.clientVerifStatus);
          await this.securityService.resetTries(id);

          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ blockSeconds: `You was blocked, you can try again after 10 minutes.` });
        }

        return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Verification code is invalid' });
      }

      await this.securityService.resetTries(id);

      return res.status(StatusCodes.OK).json({ msg: 'Success!' });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
  };
}
