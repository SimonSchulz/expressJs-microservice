/* eslint-disable no-console */
import { getRepository } from 'typeorm';
import Client from '../entities/client.entity';
import UpdateDataDto from '../registration/dto/updateData.dto';

class UserService {
  async getUser(receiver: string) {
    return getRepository(Client).findOne({ mobilePhone: receiver });
  }
  async updateUser(user, updateData) {
    await getRepository(Client).save({ ...user, ...updateData });
  }
}

export default UserService;
