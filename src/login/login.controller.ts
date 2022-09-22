import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { UserService } from '../user/user.service';
import { UpdateUserPasswordDto } from './dto/UpdateUserPassword.dto';
import { plainToClass } from 'class-transformer';
import { ClientStatus, ErrorMessages } from '../utils/helpers/constants';
import bcrypt from 'bcrypt';

export default class LoginController {
  constructor(private userService: UserService) {
    this.userService = new UserService();
  }

  public updateUserPassword = async (req: Request, res: Response) => {
    try {
      let { mobilePhone, newPassword } = plainToClass(UpdateUserPasswordDto, req.body);

      const user = await this.userService.getUser(String(mobilePhone));
      if (!user) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: ErrorMessages.NOT_FOUND });
      }
      switch (user.clientStatus) {
        case ClientStatus.IS_CLIENT:
        case ClientStatus.ACTIVE: {
          let check = await bcrypt.compareSync(newPassword, user.password);

          if (check) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: ErrorMessages.SAME_PASSWORD });
          } else {
            newPassword = await this.userService.genHashPassword(newPassword);
            await this.userService.updateUserPassword(user.clientId, newPassword);
            res.status(StatusCodes.OK).json({ msg: ErrorMessages.SUCCESS });
          }
        }
      }
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: ErrorMessages.NOT_FOUND });
    }
  };
}
