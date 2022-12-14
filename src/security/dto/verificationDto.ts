import { IsDefined, IsEmail, IsNumberString, IsUUID, Length } from 'class-validator';

export class VerificationDto {
  @IsDefined()
  @IsUUID()
  id: string;

  @Length(6)
  @IsNumberString()
  @IsDefined()
  verificationCode: string;
}
