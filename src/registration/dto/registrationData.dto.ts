import { IsBoolean, IsDefined, IsEmail, IsNumberString, IsString, Length, Matches } from 'class-validator';

export class RegistrationDataDto {
  @Length(11)
  @IsNumberString()
  @IsDefined()
  mobilePhone: string;

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

  @IsDefined()
  @IsString()
  firstName: string;
  middleName: string;
  @IsDefined()
  @IsString()
  lastName: string;

  @IsDefined()
  @IsNumberString()
  passportNumber: string;

  @IsBoolean()
  countryOfResidence: boolean;
}
