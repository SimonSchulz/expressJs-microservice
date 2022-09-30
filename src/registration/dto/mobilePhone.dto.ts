import { IsDefined, IsNumberString, MaxLength, MinLength } from 'class-validator';

export class MobilePhoneDto {
  @MinLength(11)
  @MaxLength(11)
  @IsNumberString()
  @IsDefined()
  mobilePhone: string;
}
