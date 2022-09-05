/* eslint-disable no-console */
import { getRepository } from 'typeorm';
import Client from '../entities/client.entity';

class UserService {
  async getUser(receiver: string) {
    return getRepository(Client).findOne({ mobilePhone: receiver });
  }
}

export default UserService;
