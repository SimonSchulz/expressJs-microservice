/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable no-console */
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import UserService from '../user/user.service';
import getExpirationTime from '../utils/helpers/getExpirationTime';
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

      if (!user) {
        return res.status(StatusCodes.CONFLICT).json({ msg: "User with this phone number doesn't exist" });
      }

      const id = await this.securityService.sendCode(String(receiver));

      return res.status(StatusCodes.OK).json({ id });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
  };

  public checkVerificationCode = async (req: Request, res: Response) => {
    try {
      const { mobilePhone, verificationCode, id } = req.body;
      const dataToCheck = await this.securityService.checkCode(mobilePhone);

      if (verificationCode !== dataToCheck.verificationCode || id !== dataToCheck.id) {
        const newTries = dataToCheck.tries + 1;
        const triesLeft = +process.env.MAX_CODE_TRIES - +newTries;
        console.log(newTries, triesLeft);

        if (triesLeft <= 0) {
          const now = new Date();
          const clientBlockageTime = getExpirationTime(+process.env.USER_BLOCK_EXPIRATION);
          const timeLeft = new Date(Number(clientBlockageTime) - Number(now)).getMinutes().toString();

          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ blockSeconds: `You was blocked, you can try again after ${timeLeft} minutes.` });
        }

        return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Verification code is invalid' });
      }

      if (timeDiffInMinutes(dataToCheck.updatedAt) >= +process.env.CODE_EXPIRATION_TIME) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Verification code expired!' });
      }

      await this.securityService.resetTries(mobilePhone, id);

      return res.status(StatusCodes.OK).json({ msg: 'Success!' });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
  };
}
