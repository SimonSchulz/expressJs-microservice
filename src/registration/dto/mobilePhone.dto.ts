import { IsDefined, IsNumberString, Length } from 'class-validator';

export class MobilePhoneDto {
  @Length(11)
  @IsNumberString()
  @IsDefined()
  mobilePhone: string;
}
