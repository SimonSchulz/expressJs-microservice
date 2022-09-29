import { IsDefined, IsNumberString, IsUUID, Length } from 'class-validator';

export class VerificationDto {
  @Length(6)
  @IsNumberString()
  @IsDefined()
  verificationCode: string;

  @IsDefined()
  @IsUUID()
  id: string;
}
