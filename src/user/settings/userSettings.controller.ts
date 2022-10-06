import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import TokenController from '../../token/token.controller';
import messages from '../../utils/helpers/messages';
import UserService from '../user.service';

class UserSettingsController {
  constructor(private userService: UserService, private tokenController: TokenController) {
    this.userService = new UserService();
    this.tokenController = new TokenController(this.userService);
  }

  public changeUserSettings = async (req: Request, res: Response) => {
    const updateData = req.body;
    const errorMessages = [];
    const user = await this.userService.getUser(updateData.clientId);

    if (updateData.newEmail && updateData.newEmail === user.email) {
      errorMessages.push(messages.SAME_EMAIL);
    }
    if (updateData.newPassword) {
      const passCheck = await this.userService.checkUserPassword(user, updateData.password);
      const newHashPass = await this.userService.genHashPassword(updateData.newPassword);
      const newPassCheck = await this.userService.checkUserPassword(user, newHashPass);
      if (passCheck && !newPassCheck) {
        updateData.newPassword = newHashPass;
      } else {
        errorMessages.push(messages.INVALID_PASSWORD);
      }
    }
    if (updateData.securityQuestionAnswer) {
      const securityQuestionCheck = await this.userService.checkSecQuestionData(updateData);
      if (securityQuestionCheck) {
        updateData.securityQuestionAnswer = await this.userService.genHashPassword(updateData.securityQuestionAnswer);
        if (updateData.securityQuestionId) {
          updateData.securityQuestion = null;
        } else {
          updateData.securityQuestionId = null;
        }
      } else {
        errorMessages.push(messages.INVALID_SECURITY_DATA);
      }
    }
    if (updateData.mobilePhone && updateData.mobilePhone === user.mobilePhone) {
      errorMessages.push(messages.SAME_PHONE);
    }

    if (errorMessages.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errorMessages: errorMessages });
    } else {
      try {
        await this.userService.updateUserData(updateData.clientId, updateData);
        return res.status(StatusCodes.OK).json({ msg: messages.SUCCESS });
      } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.ERROR });
      }
    }
  };
}

export default UserSettingsController;
