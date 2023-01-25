import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
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
      //console.log(file)
      const fileExtension = req.fileExtension;
      //console.log(fileExtension)
      const clientId = req.userDecodedData.userId;
      const avatarName = uuidv4() + '.' + fileExtension;
      const user = await this.userService.getUser({ clientId });

      if (!user.avatar) {
        fs.unlinkSync(path.join(staticPath, user.avatar));
      }

      file.mv(path.join(staticPath, avatarName));
      await this.userService.updateUserData(clientId, { avatar: avatarName });

      return res.status(StatusCodes.OK).json({ avatarName });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
  };

  public deleteAvatar = async (req: TypedRequestBody, res: Response) => {
    try {
      const clientId = req.userDecodedData.userId;
      const user = await this.userService.getUser({ clientId });

      if (!user.avatar) {
        return res.status(StatusCodes.NOT_FOUND).json({ msg: messages.AVATAR_NOT_FOUND });
      }

      fs.unlinkSync(path.join(staticPath, user.avatar));

      await this.userService.updateUserData(clientId, { avatar: null });

      return res.status(StatusCodes.OK).json({ msg: messages.SUCCESS });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
  };

  public getAvatar = async (req: TypedRequestBody, res: Response) => {
    try {
      const clientId = req.userDecodedData.userId;
      const { avatar } = await this.userService.getUser({ clientId });

      if (!avatar) {
        return res.status(StatusCodes.NOT_FOUND).json({ msg: messages.AVATAR_NOT_FOUND });
      }

      return res.status(StatusCodes.OK).json({ avatar });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
  };
}

export default UserInformationController;
