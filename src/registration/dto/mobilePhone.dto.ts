import { IsDefined, IsEmail, IsNumberString, MaxLength, MinLength } from 'class-validator';

export class MobilePhoneDto {
  @IsNumberString()
  @IsDefined()
  @IsEmail()
  email: string;
}
