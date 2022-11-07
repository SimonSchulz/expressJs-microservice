/* eslint-disable no-return-await */
/* eslint-disable no-console */
import { getRepository } from 'typeorm';
import VerificationEntity from '../entities/verification.entity';
import nodemailer from "nodemailer";
import { emailService } from '../utils/helpers/constants';

class SecurityService {
  public async sendCode(email, codeExpiration: Date, lastSentEmailTime: Date) {
    const verificationCode = process.env.VERIFICATION_CODE;
    const existedEmail = await getRepository(VerificationEntity).findOne({ email });

    let transport = nodemailer.createTransport({
      host: process.env.NODAMAILER_HOST,
      secure: true,
      port: 465,
      auth: {
        user: process.env.NODAMAILER_USER,
        pass: process.env.NODAMAILER_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.NODAMAILER_MAIL,
      to: email,
      subject: emailService.subject,
      text: `${emailService.text} ${verificationCode}`,
    };
    
    transport.sendMail(mailOptions, function(err, info) {
      if (err) {
        console.log(err)
      }
    });

    if (!existedEmail) {
      const id = await getRepository(VerificationEntity).insert({
        email,
        verificationCode,
        codeExpiration,
        lastSentEmailTime,
      });
  
      return id.identifiers[0].id;
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
