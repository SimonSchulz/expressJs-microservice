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
  @MinLength(1)
  securityQuestionType: string;

  @IsString()
  @IsUUID()
  @MinLength(1)
  securityQuestionId: string;

  @IsString()
  @MinLength(1)
  securityQuestion: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  securityQuestionAnswer: string;
}
