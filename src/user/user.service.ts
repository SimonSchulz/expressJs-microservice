/* eslint-disable no-console */
import { getRepository } from 'typeorm';
import Client from '../entities/client.entity';
import bcrypt from 'bcryptjs';
import SecurityQuestionsTypes from '../utils/helpers/securityQuestionsTypes';
import VerificationEntity from '../entities/verification.entity';
import ClientVerifStatus from '../utils/helpers/ClientVerifStatus';

class UserService {
  async getUser(param: object) {
    return await getRepository(Client).findOne(param);
  }
  async updateUser(user, updateData) {
    updateData.securityAnswer = await this.genHashPassword(updateData.securityAnswer);
    if (updateData.securityQuestionType === SecurityQuestionsTypes.PREDEFINED) {
      updateData.securityQuestion = null;
    } else {
      updateData.securityQuestionId = null;
    }
    await getRepository(Client).save({ ...user, ...updateData });
  }
  async checkUserVerification(user) {
    let verifData = await getRepository(VerificationEntity).findOne({ mobilePhone: user.mobilePhone });

    if (verifData && verifData.clientVerifStatus && verifData.clientVerifStatus === ClientVerifStatus.ACTIVE) {
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
