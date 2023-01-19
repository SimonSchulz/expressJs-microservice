import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import TokenController from '../../token/token.controller';
import { messages } from '../../utils/helpers/messages';
import UserService from '../user.service';
import { TypedRequestBody } from '../../utils/tokenMiddleware';

class UserInformationController {
  constructor(private userService: UserService, private tokenController: TokenController) {
    this.userService = new UserService();
    this.tokenController = new TokenController(this.userService);
  }

  public sendUserData = async (req: TypedRequestBody, res: Response) => {
    try {
      const clientId = req.userDecodedData.userId;
      const passportNumber = req.query.passportId;
      const user = await this.userService.getUser({ clientId });

      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({ msg: messages.USER_DOESNT_EXIST });
      }

      const { firstName, lastName, mobilePhone, email, passportId, isResident } = user;

      if (passportNumber !== passportId) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: messages.PASSPORT_IS_INVALID });
      }

      const personalInfo = {
        firstName,
        lastName,
        mobilePhone,
        email,
        passportNumber,
        isResident,
      };
      return res.status(StatusCodes.OK).json({ userData: personalInfo });
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: messages.ERROR });
    }
  };
}

export default UserInformationController;
