import { getRepository } from 'typeorm';
import bcrypt from 'bcryptjs';
import Client from '../entities/client.entity';
import { SecurityQuestionsTypes } from '../utils/helpers/securityQuestionsTypes';
import SecurityQuestionEntity from '../entities/security-question.entity';
import VerificationEntity from '../entities/verification.entity';
import { ClientVerifStatus } from '../utils/helpers/ClientVerifStatus';
import { ErrorMessages } from '../utils/helpers/constants';
import { ClientStatus } from '../utils/helpers/ClientStatus';

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

  public async updateUserStatus(email) {
    await getRepository(Client).update({ email }, { clientStatus: ClientStatus.REGISTERED });
  }

  public async insertRefreshToken(id: number, refreshToken: string) {
    await getRepository(Client).save({ refreshToken });
  }

  async checkAllParams(user, updateData) {
    const checkSecAnswerSpaces = updateData.securityQuestionAnswer.includes('  ');
    const checkSecQuestionSpaces = updateData.securityQuestion.includes('  ');
    const checkPasswords = await this.checkUserPassword(user, updateData.password);
    const checkVerifStatus = await this.checkUserVerification(user);
    const newPassword = await this.genHashPassword(updateData.password);
    const secQuestAnswer = await this.genHashPassword(updateData.securityQuestionAnswer);
    const secQuestTypes = await this.checkSecQuestionData(updateData);
    if (!checkPasswords && checkVerifStatus && secQuestTypes && !checkSecQuestionSpaces && !checkSecAnswerSpaces)
      return { checks: true, newPassword: newPassword, secQuestAnswer: secQuestAnswer };
    return {
      checks: false,
      checkSecQuestionSpaces: checkSecQuestionSpaces,
      checkSecAnswerSpaces: checkSecAnswerSpaces,
      newPassword: newPassword,
      passwordCheck: checkPasswords,
      verifCheck: checkVerifStatus,
      secQuestTypes: secQuestTypes,
    };
  }
  async handleError(allCheck) {
    if (allCheck.checkSecQuestionSpaces === true) {
      return ErrorMessages.INVALID_QUESTION_FORMAT;
    }
    if (allCheck.checkSecAnswerSpaces === true) {
      return ErrorMessages.INVALID_ANSWER_FORMAT;
    }
    if (allCheck.passwordCheck === true) {
      return ErrorMessages.SAME_PASS;
    }
    if (allCheck.verifCheck === false) {
      return ErrorMessages.NOT_VERIFIED;
    }
    if (allCheck.secQuestTypes === false) {
      return ErrorMessages.INVALID_QUESTION_FORMAT;
    }
  }

  async checkUserVerification(user) {
    const verifData = await getRepository(VerificationEntity).findOne({ email: user.email.toLowerCase() });

    if (verifData && verifData.clientVerifStatus === ClientVerifStatus.ACTIVE) {
      return true;
    }
    return false;
  }
  async checkSecQuestionData(updateData) {
    const checkId = await getRepository(SecurityQuestionEntity).findOne({
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
  async checkSecQuestionId(id) {
    return await getRepository(SecurityQuestionEntity).findOne({ id });
  }
  async checkSecurityQuestionAnswer(userSecQuestion, secQuestion) {
    return await bcrypt.compareSync(secQuestion, userSecQuestion);
  }
  async checkUserPassword(user, newPassword) {
    const check = await bcrypt.compareSync(newPassword, user.password);
    return check;
  }
  async genHashPassword(password: string) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
  }
  async createUser(registrationData) {
    const date = new Date(Date.now());

    registrationData.password = await this.genHashPassword(registrationData.password);
    registrationData.securityQuestionAnswer = await this.genHashPassword(registrationData.securityQuestionAnswer);

    return await getRepository(Client).insert({
      password: registrationData.password,
      securityQuestion: registrationData.securityQuestion.toLowerCase(),
      securityQuestionId: registrationData.securityQuestionId,
      securityQuestionType: registrationData.securityQuestionType,
      securityQuestionAnswer: registrationData.securityQuestionAnswer,
      secQuestionValidAttempts: +process.env.MAX_SECURITY_QUESTIONS_TRIES || 3,
      clientStatus: ClientStatus.REGISTERED,
      email: registrationData.email.toLowerCase(),
      firstName: registrationData.firstName,
      lastName: registrationData.lastName,
      passportId: registrationData.passportNumber,
      isResident: registrationData.isResident,
      accesionDate: date,
      registrationDate: date,
    });
  }
}

export default UserService;
