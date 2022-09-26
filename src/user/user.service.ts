/* eslint-disable no-console */
import { getRepository } from 'typeorm';
import Client from '../entities/client.entity';
import { ClientStatus } from '../utils/helpers/constants';

class UserService {
  async getUser(receiver: string) {
    return getRepository(Client).findOne({ mobilePhone: receiver });
  }
  async updateUser(user, updateData) {
    await getRepository(Client).save({ ...user, ...updateData });
  }
  async createUser(registrationData) {
    if (registrationData) {
      const check = await getRepository(Client).findOne({ mobilePhone: registrationData.mobilePhone });

      if (!check) {
        let date = new Date(Date.now());

        await getRepository(Client).insert({
          mobilePhone: registrationData.mobilePhone,
          password: registrationData.password,
          securityQuestion: registrationData.securityQuestion,
          securityAnswer: registrationData.securityAnswer,
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
