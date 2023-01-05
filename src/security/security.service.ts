/* eslint-disable no-return-await */
/* eslint-disable no-console */
import { getRepository } from 'typeorm';
import VerificationEntity from '../entities/verification.entity';
import Client from '../entities/client.entity';

class SecurityService {
  public async sendCode(email, codeExpiration: Date, lastSentEmailTime: Date) {
    const verificationCode = process.env.VERIFICATION_CODE;
    const existedEmail = await getRepository(VerificationEntity).findOne({ email });

    if (!existedEmail) {
      await getRepository(VerificationEntity).insert({
        email,
        verificationCode,
        codeExpiration,
        lastSentEmailTime,
      });
    } else {
      await getRepository(VerificationEntity).update(
        { email },
        { verificationCode, codeExpiration, lastSentEmailTime }
      );
    }
    const data = await getRepository(VerificationEntity).findOne({ email });

    return data;
  }

  public async getVerifDataByParam(param: object) {
    return await getRepository(VerificationEntity).findOne(param);
  }
  public async removeVerifRecord(param: object) {
    return await getRepository(VerificationEntity).delete(param);
  }

  public async updateUserByParam(param, newClientData: object) {
    await getRepository(Client).update(param, newClientData);
  }

  public async updateByParam(param, newClientData: object) {
    await getRepository(VerificationEntity).update(param, newClientData);
  }

  public async checkCode(smsId: string) {
    const { id, verificationCode, updatedAt, invalidAttempts, lastInvalidAttemptTime, codeExpiration } =
      await getRepository(VerificationEntity).findOne(smsId);

    await getRepository(VerificationEntity).update({ id: smsId }, { invalidAttempts: invalidAttempts + 1 });

    return { id, verificationCode, updatedAt, invalidAttempts, lastInvalidAttemptTime, codeExpiration };
  }
}

export default SecurityService;
