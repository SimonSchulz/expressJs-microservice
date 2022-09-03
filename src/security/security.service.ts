import { getRepository } from 'typeorm';
import VerificationEntity from '../entities/verification.entity';

class SecurityService {
  public async sendSms(receiver: string) {
    const verificationCode = process.env.VERIFICATION_CODE;

    await getRepository(VerificationEntity).insert({ mobilePhone: receiver, verificationCode });
  }

  public async getId(receiver) {
    const { id } = await getRepository(VerificationEntity).findOne({
      where: { mobilePhone: receiver },
      order: { created_at: 'DESC' },
    });

    return getRepository(VerificationEntity).findOne({ id: id as string });
  }
}

export default SecurityService;
