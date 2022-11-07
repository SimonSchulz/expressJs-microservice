/* eslint-disable no-return-await */
/* eslint-disable no-console */
import { getRepository } from 'typeorm';
import VerificationEntity from '../entities/verification.entity';
import nodemailer from "nodemailer";

class SecurityService {
  public async sendCode(email, codeExpiration: Date, lastSentEmailTime: Date) {
    const verificationCode = process.env.VERIFICATION_CODE;
    const existedEmail = await getRepository(VerificationEntity).findOne({ email });

    if (!existedEmail) {
      try {
        const id = await getRepository(VerificationEntity).insert({
          email,
          verificationCode,
          codeExpiration,
          lastSentEmailTime,
        });
  
        return id.identifiers[0].id;

      } catch (error) {
        console.log(error);
      }
    }

    await getRepository(VerificationEntity).update(
      { email },
      { verificationCode, codeExpiration, lastSentEmailTime }
    );

    const { id } = await getRepository(VerificationEntity).findOne({ email });

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
