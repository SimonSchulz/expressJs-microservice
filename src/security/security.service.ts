/* eslint-disable no-console */
import { getRepository } from 'typeorm';
import VerificationEntity from '../entities/verification.entity';

class SecurityService {
  public async sendCode(receiver: string) {
    const verificationCode = process.env.VERIFICATION_CODE;

    const id = await getRepository(VerificationEntity).insert({ mobilePhone: receiver, verificationCode });

    return id.identifiers[0].id;
  }
}
export default SecurityService;
