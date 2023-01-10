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
      const clientId = req.query;
      const user = await this.userService.getUser(clientId);
      if (!user) return res.status(StatusCodes.NOT_FOUND).json({ msg: messages.USER_DOESNT_EXIST });
      const sendData = {
        firstName: user.firstName,

        lastName: user.lastName,

        middleName: user.middleName ? user.middleName : null,

        mobilePhone: user.mobilePhone,

        email: user.email ? user.email : null,

        passportNumber: user.passportId ? user.passportId : null,

        isResident: user.isResident,
      };
      return res.status(StatusCodes.OK).json({ userData: sendData });
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: messages.ERROR });
    }
  };
}

export default UserInformationController;
