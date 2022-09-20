/* eslint-disable no-console */
import { getRepository } from 'typeorm';
import Client from '../entities/client.entity';

class UserService {
  public async getUser(param: object) {
    return getRepository(Client).findOne(param);
  }

  public async updateUser(clientId: number, objData: object) {
    await getRepository(Client).update({ clientId }, objData);
  }

  public async createRefreshToken(id: number, refreshToken: string) {
    await getRepository(Client)
      .createQueryBuilder()
      .update(Client)
      .set({ refreshToken: refreshToken as string })
      .where({ id: id as number })
      .execute();
  }
}

export default UserService;
