import { IsDefined, IsEmail, IsString, IsUUID, Matches } from 'class-validator';

export default class UpdateUserProfileDto {
  id: string;

  @IsEmail()
  @IsDefined()
  email: string;

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
  securityQuestionAnswer: string;
}
