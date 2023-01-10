import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { messages } from '../../utils/helpers/messages';
import UserService from '../user.service';

class UserInformationController {
  constructor(private userService: UserService) {
    this.userService = new UserService();
  }
  public sendUserData = async (req: Request, res: Response) => {
    try {
      const passportId = req.query;
      const user = await this.userService.getUser(passportId);
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({ msg: messages.USER_DOESNT_EXIST });
      }

      const personalInfo = {
        firstName: user.firstName,

        lastName: user.lastName,

        mobilePhone: user.mobilePhone,

        email: user.email,

        passportNumber: user.passportId,

        isResident: user.isResident,
      };
      return res.status(StatusCodes.OK).json({ userData: personalInfo });
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: messages.ERROR });
    }
  };
}

export default UserInformationController;
