import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import UserService from '../user/user.service';
import { UpdateUserPasswordDto } from './dto/UpdateUserPassword.dto';
import { plainToClass } from 'class-transformer';
import { ErrorMessages } from '../utils/helpers/constants';
import ClientStatus from '../utils/helpers/ClientStatus';
import bcrypt from 'bcrypt';
import messages from '../utils/helpers/messages';

export default class LoginController {
  constructor(private userService: UserService) {
    this.userService = new UserService();
  }

  public updateUserPassword = async (req: Request, res: Response) => {
    try {
      let { mobilePhone, newPassword, oldPassword } = plainToClass(UpdateUserPasswordDto, req.body);
      const user = await this.userService.getUser({ mobilePhone });
      if (!user) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: ErrorMessages.NOT_FOUND });
      }
      if (user.clientStatus === ClientStatus.ACTIVE || user.clientStatus === ClientStatus.IS_CLIENT) {
        const checkNewPassword = await bcrypt.compareSync(newPassword, user.password);
        const checkOldPassword = await bcrypt.compareSync(oldPassword, user.password);

        if (checkNewPassword || !checkOldPassword) {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.SAME_PASSWORD });
        } else {
          newPassword = await this.userService.genHashPassword(newPassword);
          await this.userService.updateUserData(user.clientId, { password: newPassword });
          res.status(StatusCodes.OK).json({ msg: ErrorMessages.SUCCESS });
        }
      } else {
        res.status(StatusCodes.OK).json({ clientStatus: user.clientStatus });
      }
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: ErrorMessages.NOT_FOUND });
    }
  };
}
