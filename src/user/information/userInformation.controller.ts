import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';
import TokenController from '../../token/token.controller';
import { messages } from '../../utils/helpers/messages';
import UserService from '../user.service';
import { TypedRequestBody } from '../../utils/tokenMiddleware';
import * as path from 'path';
import { staticPath } from '../../config';

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

  public uploadAvatar = async (req: TypedRequestBody, res: Response) => {
    try {
      const file = req.files.file;
      const clientId = req.userDecodedData.userId;
      console.log(file);
      //const user = await this.userService.getUser({ clientId });
      const avatarName = uuidv4() + '.jpg';
      //console.log(staticPath);
      await file.mv(path.join(staticPath, avatarName));

      await this.userService.updateUserData(clientId, { avatar: avatarName });

      return res.status(StatusCodes.OK).json({ msg: 'success' });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'avatar error' });
    }
  };
}

export default UserInformationController;
