/* eslint-disable no-console */
import { getRepository } from 'typeorm';
import VerificationEntity from '../entities/verification.entity';

class SecurityService {
  public async sendCode(receiver: string) {
    const verificationCode = process.env.VERIFICATION_CODE;

    const existedPhone = await getRepository(VerificationEntity).findOne({ mobilePhone: receiver });

    if (!existedPhone) {
      const id = await getRepository(VerificationEntity).insert({ mobilePhone: receiver, verificationCode });

      return id.identifiers[0].id;
    }

    await getRepository(VerificationEntity).update({ mobilePhone: receiver }, { verificationCode });

    const { id } = await getRepository(VerificationEntity).findOne({ mobilePhone: receiver });

    return id;
  }

  public async checkCode(mobilePhone: string) {
    const { id, verificationCode, updatedAt, tries } = await getRepository(VerificationEntity).findOne({
      mobilePhone: mobilePhone as string,
    });

    await getRepository(VerificationEntity).update({ mobilePhone }, { tries: tries + 1 });

    return { id, verificationCode, updatedAt, tries };
  }

  public async resetTries(mobilePhone: string, id: string) {
    const { tries } = await getRepository(VerificationEntity).findOne({ mobilePhone: mobilePhone as string, id });

    await getRepository(VerificationEntity)
      .createQueryBuilder()
      .update(VerificationEntity)
      .set({ tries: 0 })
      .where({ mobilePhone: mobilePhone as string, id: id as string })
      .execute();
    return tries;
  }
}

export default SecurityService;
