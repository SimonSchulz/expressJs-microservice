import { IsDefined, IsEmail, IsNumberString, IsString, IsUUID, Matches, MaxLength, MinLength } from 'class-validator';

export default class UpdateUserProfileDto {
  @MinLength(11)
  @MaxLength(11)
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
  securityQuestionType: string;

  @IsString()
  @IsUUID()
  securityQuestionId: string;

  @IsString()
  securityQuestion: string;

  @IsDefined()
  @IsString()
  securityAnswer: string;

  @IsEmail()
  email: string;
}
