/* eslint-disable no-console */
import { getRepository } from 'typeorm';
import Client from '../entities/client.entity';
import bcrypt from 'bcryptjs';
import SecurityQuestionsTypes from '../utils/helpers/securityQuestionsTypes';
import VerificationEntity from '../entities/verification.entity';
import ClientVerifStatus from '../utils/helpers/ClientVerifStatus';
import ErrorMessages from '../utils/helpers/errorMessages';
import SecurityQuestionEntity from '../entities/seqQuests.entity';

class UserService {
  async getUser(param: object) {
    return await getRepository(Client).findOne(param);
  }
  async updateUser(user, updateData) {
    updateData.securityQuestionAnswer = await this.genHashPassword(updateData.securityQuestionAnswer);
    if (updateData.securityQuestionType === SecurityQuestionsTypes.PREDEFINED) {
      updateData.securityQuestion = null;
    } else {
      updateData.securityQuestionId = null;
    }
    await getRepository(Client).save({ ...user, ...updateData });
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
  async handleError(allCheck) {
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
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
  }
}

export default UserService;
