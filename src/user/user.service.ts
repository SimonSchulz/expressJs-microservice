/* eslint-disable no-console */
import { getRepository } from 'typeorm';
import bcrypt from 'bcryptjs';
import Client from '../entities/client.entity';
import SecurityQuestionsTypes from '../utils/helpers/securityQuestionsTypes';
import SecurityQuestionEntity from '../entities/seqQuests.entity';
import VerificationEntity from '../entities/verification.entity';
import ClientVerifStatus from '../utils/helpers/ClientVerifStatus';
import messages from '../utils/helpers/messages';
import { ClientStatus, ErrorMessages } from '../utils/helpers/constants';

class UserService {
  async getUser(param: object) {
    return await getRepository(Client).findOne(param);
  }
  async changeUserQuestionType(user, updateData) {
    const clientId = user.clientId;
    updateData.securityQuestionAnswer = await this.genHashPassword(updateData.securityQuestionAnswer);
    if (updateData.securityQuestionType === SecurityQuestionsTypes.PREDEFINED) {
      updateData.securityQuestion = null;
      await getRepository(Client).update({ clientId }, { securityQuestion: updateData.securityQuestion });
    } else {
      updateData.securityQuestionId = null;
      await getRepository(Client).update({ clientId }, { securityQuestionId: updateData.securityQuestionId });
    }
  }

  public async updateUserData(clientId: number, objData: object) {
    await getRepository(Client).update({ clientId }, objData);
  }
  public async insertRefreshToken(id: number, refreshToken: string) {
    await getRepository(Client).save({ refreshToken });
  }

  async checkAllParams(user, updateData) {
    let checkPasswords = await this.checkUserPassword(user, updateData.password);
    let checkVerifStatus = await this.checkUserVerification(user);
    let newPassword = await this.genHashPassword(updateData.password);
    let secQuestTypes = await this.checkSecQuestionData(updateData);
    if (!checkPasswords && checkVerifStatus && secQuestTypes) return { checks: true, newPassword: newPassword };
    return {
      checks: false,
      newPassword: newPassword,
      passwordCheck: checkPasswords,
      verifCheck: checkVerifStatus,
      secQuestTypes: secQuestTypes,
    };
  }
  handleError(allCheck) {
    if (allCheck.passwordCheck) {
      return ErrorMessages.SAME_PASS;
    }
    if (!allCheck.verifCheck) {
      return ErrorMessages.NOT_VERIFIED;
    }
    if (!allCheck.secQuestTypes) {
      return ErrorMessages.INVALID_QUESTION_FORMAT;
    }
  }
  async checkUserVerification(user) {
    let verifData = await getRepository(VerificationEntity).findOne({ mobilePhone: user.mobilePhone });

    if (verifData && verifData.clientVerifStatus && verifData.clientVerifStatus === ClientVerifStatus.ACTIVE) {
      return true;
    }
    return false;
  }
  async checkSecQuestionData(updateData) {
    let checkId = await getRepository(SecurityQuestionEntity).findOne({
      id: updateData.securityQuestionId,
    });

    if (
      updateData.securityQuestionType === SecurityQuestionsTypes.PREDEFINED &&
      updateData.securityQuestionId &&
      !updateData.securityQuestion &&
      checkId
    ) {
      return true;
    }
    if (
      updateData.securityQuestionType === SecurityQuestionsTypes.SELF_DEFINED &&
      updateData.securityQuestion &&
      !updateData.securityQuestionId &&
      updateData.securityQuestion.length < 30
    ) {
      return true;
    }
    return false;
  }
  async checkUserPassword(user, newPassword) {
    let check = await bcrypt.compareSync(newPassword, user.password);
    return check;
  }
  async genHashPassword(password: string) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
  }
  async createUser(registrationData) {
    if (registrationData) {
      const user = await getRepository(Client).findOne({ mobilePhone: registrationData.mobilePhone });

      if (!user) {
        let date = new Date(Date.now());

        registrationData.password = await this.genHashPassword(registrationData.password);

        await getRepository(Client).insert({
          mobilePhone: registrationData.mobilePhone,
          password: registrationData.password,
          securityQuestion: registrationData.securityQuestion,
          securityQuestionAnswer: registrationData.securityQuestionAnswer,
          clientStatus: ClientStatus.ACTIVE,
          email: registrationData.email,
          firstName: registrationData.firstName,
          middleName: registrationData.middleName,
          lastName: registrationData.lastName,
          passportId: registrationData.passportNumber,
          countryOfResidence: registrationData.countryOfResidence,
          accesionDate: date,
          registrationDate: date,
        });

        return true;
      } else {
        return false;
      }
    }
  }
}

export default UserService;
