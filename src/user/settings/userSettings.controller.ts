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
    try {
      const updateData = req.body;
      const errorMessages = [];
      const user = await this.userService.getUser(updateData.clientId);

      if (updateData.newEmail) {
        if (updateData.newEmail !== user.email) {
          await this.userService.updateUserData(updateData.clientId, { email: updateData.newEmail });
        } else {
          errorMessages.push(messages.SAME_EMAIL);
        }
      }
      if (updateData.newPassword) {
        const passCheck = await this.userService.checkUserPassword(user, updateData.password);
        const newHashPass = await this.userService.genHashPassword(updateData.newPassword);
        const newPassCheck = await this.userService.checkUserPassword(user, newHashPass);
        if (passCheck && !newPassCheck) {
          await this.userService.updateUserData(updateData.clientId, { password: newHashPass });
        } else {
          errorMessages.push(messages.INVALID_PASSWORD);
        }
      }
      if (updateData.securityQuestionAnswer) {
        const securityQuestionCheck = await this.userService.checkSecQuestionData(updateData);
        if (securityQuestionCheck) {
          if (updateData.securityQuestionId) {
            await this.userService.updateUserData(updateData.clientId, {
              securityQuestionId: updateData.securityQuestionId,
              securityQuestion: null,
              securityQuestionType: updateData.securityQuestionType,
              securityQuestionAnswer: await this.userService.genHashPassword(updateData.securityQuestionAnswer),
            });
          } else {
            await this.userService.updateUserData(updateData.clientId, {
              securityQuestion: updateData.securityQuestion,
              securityQuestionId: null,
              securityQuestionType: updateData.securityQuestionType,
              securityQuestionAnswer: await this.userService.genHashPassword(updateData.securityQuestionAnswer),
            });
          }
        } else {
          errorMessages.push(messages.INVALID_SECURITY_DATA);
        }
      }
      if (updateData.mobilePhone) {
        if (updateData.mobilePhone !== user.mobilePhone) {
          await this.userService.updateUserData(updateData.clientId, { mobilePhone: updateData.mobilePhone });
        } else {
          errorMessages.push(messages.SAME_PHONE);
        }
      }

      if (errorMessages.length > 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({ errorMessages: errorMessages });
      } else {
        return res.status(StatusCodes.OK).json({ msg: messages.SUCCESS });
      }
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: messages.ERROR });
    }
  };
}

export default UserSettingsController;
