/* eslint-disable no-console */
import { getRepository } from 'typeorm';
import VerificationEntity from '../entities/verification.entity';

class SecurityService {
  constructor() {
    this.getUser = this.getUser.bind(this);
    this.sendSms = this.sendSms.bind(this);
  }

  public async getUser(receiver: string) {
    console.log('Check 2');
    return getRepository(VerificationEntity).findOne({ mobilePhone: receiver });
  }

  public async sendSms(body: { receiver: string }) {
    const verificationCode = process.env.VERIFICATION_CODE;
    await getRepository(VerificationEntity).insert({ mobilePhone: body.receiver, verificationCode });

    const { id } = await getRepository(VerificationEntity).findOne();

    console.log('Check 3');

    return getRepository(VerificationEntity).findOne({ id: id as string });
  }
}

export default SecurityService;
