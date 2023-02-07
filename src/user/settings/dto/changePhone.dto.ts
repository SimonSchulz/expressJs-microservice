import { Length, IsNumberString, IsDefined, IsNotEmpty } from 'class-validator';

export class ChangeMobilePhoneDto {
  @IsDefined()
  @IsNotEmpty()
  @Length(11)
  @IsNumberString()
  mobilePhone: string;
}
