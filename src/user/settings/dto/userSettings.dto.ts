import { IsDefined, IsEmail, IsNumberString, IsString, IsUUID, Matches, MaxLength, MinLength } from 'class-validator';

export default class ChangeUserSettingsDto {
  @MinLength(11)
  @MaxLength(11)
  @IsNumberString()
  mobilePhone: string;

  @IsDefined()
  @IsUUID()
  clientId: string;

  @IsString()
  @Matches(RegExp(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,}/g))
  password: string;

  @IsString()
  @Matches(RegExp(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,}/g))
  newPassword: string;

  @IsString()
  securityQuestionType: string;

  @IsString()
  @IsUUID()
  securityQuestionId: string;

  @IsString()
  securityQuestion: string;

  @IsString()
  securityQuestionAnswer: string;

  @IsEmail()
  email: string;
}
