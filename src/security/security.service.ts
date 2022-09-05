/* eslint-disable no-console */
import { getRepository } from 'typeorm';
import VerificationEntity from '../entities/verification.entity';

class SecurityService {
  public async sendCode(receiver: string) {
    const verificationCode = process.env.VERIFICATION_CODE;

    await getRepository(VerificationEntity).insert({ mobilePhone: receiver, verificationCode });

    const { id } = await getRepository(VerificationEntity).findOne({
      where: { mobilePhone: receiver },
      order: { created_at: 'DESC' },
    });

    return id;
  }
}
export default SecurityService;
