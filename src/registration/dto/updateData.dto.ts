import { IsDefined, IsEmail, IsString, IsUUID, Matches, MaxLength, MinLength } from 'class-validator';

export default class UpdateUserProfileDto {
  id: string;

  @IsEmail()
  @IsDefined()
  email: string;

  @IsDefined()
  @IsString()
  @Matches(RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,}$/))
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
  @Matches(RegExp(/^[0-9a-zA-Z!@#$%^& *]{2,50}$/))
  securityQuestion: string;

  @IsDefined()
  @IsString()
  @Matches(RegExp(/^[0-9a-zA-Z!@#$%^& *]{2,50}$/))
  securityQuestionAnswer: string;
}
