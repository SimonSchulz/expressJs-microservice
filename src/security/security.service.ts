/* eslint-disable no-return-await */
/* eslint-disable no-console */
import { getRepository } from 'typeorm';
import VerificationEntity from '../entities/verification.entity';

class SecurityService {
<<<<<<< HEAD
  public async sendCode(mobilePhone: string) {
    const verificationCode = process.env.VERIFICATION_CODE;

    const id = await getRepository(VerificationEntity).insert({ mobilePhone: mobilePhone as string, verificationCode });
=======
  public async sendCode(mobilePhone, codeExpiration: Date, lastSentSmsTime: Date) {
    const verificationCode = process.env.VERIFICATION_CODE;

    const existedPhone = await getRepository(VerificationEntity).findOne({ mobilePhone });
>>>>>>> fb7e0da814887616526b11f7a8dc3e22b4b531d5

    if (!existedPhone) {
      const id = await getRepository(VerificationEntity).insert({
        mobilePhone,
        verificationCode,
        codeExpiration,
        lastSentSmsTime,
      });

      return id.identifiers[0].id;
    }

    await getRepository(VerificationEntity).update(
      { mobilePhone },
      { verificationCode, codeExpiration, lastSentSmsTime }
    );

    const { id } = await getRepository(VerificationEntity).findOne({ mobilePhone });

    return id;
  }

  public async getClientDataByParam(param: object) {
    return await getRepository(VerificationEntity).findOne(param);
  }

  public async updateByClientId(id: string, newClientData: object) {
    await getRepository(VerificationEntity).update(
      { id },

      newClientData
    );
  }

  public async checkCode(smsId: string) {
    const { id, verificationCode, updatedAt, invalidAttempts, lastInvalidAttemptTime, codeExpiration } =
      await getRepository(VerificationEntity).findOne(smsId);

    await getRepository(VerificationEntity).update({ id: smsId }, { invalidAttempts: invalidAttempts + 1 });

    return { id, verificationCode, updatedAt, invalidAttempts, lastInvalidAttemptTime, codeExpiration };
  }
}

export default SecurityService;
