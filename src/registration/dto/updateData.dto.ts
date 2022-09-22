import { IsDefined, IsEmail, IsNumberString, IsString, Length, Matches } from 'class-validator';

export class UpdateUserProfileDto {
  @Length(11)
  @IsNumberString()
  @IsDefined()
  mobilePhone: string;

  id: string;

  @IsDefined()
  @IsString()
  @Matches(RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/))
  password: string;

  @IsDefined()
  @IsString()
  securityQuestion: string;

  @IsDefined()
  @IsString()
  securityAnswer: string;

  @IsEmail()
  email: string;
}
