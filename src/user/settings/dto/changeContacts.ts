import { IsEmail, Length, IsNumberString, IsString, IsNotEmpty } from 'class-validator';

export class ChangeContactsDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @Length(11)
  @IsNumberString()
  mobilePhone: string;
}
