/* eslint-disable no-return-await */
/* eslint-disable no-console */
import { getRepository } from 'typeorm';
import VerificationEntity from '../entities/verification.entity';

class SecurityService {
  public async sendCode(receiver: string, codeExpiration: Date) {
    const verificationCode = process.env.VERIFICATION_CODE;

    const existedPhone = await getRepository(VerificationEntity).findOne({ mobilePhone: receiver });

    if (!existedPhone) {
      const id = await getRepository(VerificationEntity).insert({
        mobilePhone: receiver,
        verificationCode,
        codeExpiration,
      });

      return id.identifiers[0].id;
    }

    await getRepository(VerificationEntity).update({ mobilePhone: receiver }, { verificationCode, codeExpiration });

    const { id } = await getRepository(VerificationEntity).findOne({ mobilePhone: receiver });

    return id;
  }

  public async getUser(id: string) {
    return getRepository(VerificationEntity).findOne({ id });
  }

  public async unblockUser(id, newClientStatus) {
    await getRepository(VerificationEntity).update({ id }, { clientVerifStatus: newClientStatus });
  }

  public async blockUser(id, newClientStatus) {
    return getRepository(VerificationEntity).update({ id }, { clientVerifStatus: newClientStatus });
  }

  public async checkCode(smsId: string) {
    const { id, verificationCode, updatedAt, invalidAttempts, lastInvalidAttemptTime, codeExpiration } =
      await getRepository(VerificationEntity).findOne(smsId);

    await getRepository(VerificationEntity).update({ id: smsId }, { invalidAttempts: invalidAttempts + 1 });

    return { id, verificationCode, updatedAt, invalidAttempts, lastInvalidAttemptTime, codeExpiration };
  }

  public async updateLastInvalidAttemptTime(id: string, lastInvalidAttemptTimeObj) {
    await getRepository(VerificationEntity).update({ id }, { lastInvalidAttemptTime: lastInvalidAttemptTimeObj });
  }

  public async resetTries(id: string) {
    const { invalidAttempts } = await getRepository(VerificationEntity).findOne({
      id,
    });

    await getRepository(VerificationEntity)
      .createQueryBuilder()
      .update(VerificationEntity)
      .set({ invalidAttempts: 0 })
      .where({ id })
      .execute();
    return invalidAttempts;
  }
}

export default SecurityService;
