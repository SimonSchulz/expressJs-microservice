import { IsDefined, IsEmail, IsNumberString, Length } from 'class-validator';

export class VerificationDto {
  @IsDefined()
  @IsEmail()
  email: string;

  @Length(6)
  @IsNumberString()
  @IsDefined()
  verificationCode: string;
}
