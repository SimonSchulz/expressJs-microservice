/* eslint-disable no-console */
import { getRepository } from 'typeorm';
import Client from '../entities/client.entity';
import bcrypt from 'bcryptjs';

class UserService {
  async getUser(param: object) {
    return getRepository(Client).findOne(param);
  }
  async updateUser(user, updateData) {
    updateData.securityAnswer = await this.genHashPassword(updateData.securityAnswer);
    await getRepository(Client).save({ ...user, ...updateData });
  }
  async checkUserPassword(user, newPassword) {
    console.log(user.password, newPassword);
    let check = await bcrypt.compareSync(user.password, newPassword);
    return check;
  }
  async genHashPassword(password: string) {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
  }
}

export default UserService;
