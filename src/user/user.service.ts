/* eslint-disable no-console */
import { getRepository } from 'typeorm';
import Client from '../entities/client.entity';
import { ClientStatus, ErrorMessages } from '../utils/helpers/constants';
import bcrypt from 'bcrypt';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

class UserService {
  async getUser(mobilePhone: string) {
    return getRepository(Client).findOne({ mobilePhone: mobilePhone });
  }
  async updateUser(user, updateData) {
    await getRepository(Client).save({ ...user, ...updateData });
  }
  async genHashPassword(password: string) {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
  }

  async updateUserPassword(clientId, newPassword) {
    await getRepository(Client).update({ clientId }, { password: newPassword });
  }
  async createUser(registrationData) {
    if (registrationData) {
      const user = await getRepository(Client).findOne({ mobilePhone: registrationData.mobilePhone });

      if (!user) {
        let date = new Date();
        let currentDate = `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;

        registrationData.password = await this.genHashPassword(registrationData.password);

        await getRepository(Client).insert({
          mobilePhone: registrationData.mobilePhone,
          password: registrationData.password,
          securityQuestion: registrationData.securityQuestion,
          securityAnswer: registrationData.securityQuestionAnswer,
          clientStatus: ClientStatus.ACTIVE,
          email: registrationData.email,
          firstName: registrationData.firstName,
          middleName: registrationData.middleName,
          lastName: registrationData.lastName,
          passportId: registrationData.passportNumber,
          countryOfResidence: registrationData.countryOfResidence,
          accesionDate: currentDate,
          registrationDate: currentDate,
        });

        return true;
      } else {
        return false;
      }
    }
  }
}

export default UserService;
