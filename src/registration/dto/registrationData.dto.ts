import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsNumberString,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegistrationDataDto {
  @MinLength(11)
  @MaxLength(11)
  @IsNumberString()
  @IsDefined()
  mobilePhone: string;

  @IsDefined()
  @IsString()
  @Matches(RegExp(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,}/g))
  password: string;

  @IsString()
  securityQuestion: string;

  @IsString()
  securityQuestionType: string;

  @IsString()
  @IsUUID()
  securityQuestionId: string;

  @IsDefined()
  @IsString()
  securityQuestionAnswer: string;

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
