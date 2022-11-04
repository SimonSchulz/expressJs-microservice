import { IsDefined, IsEmail, IsString, IsUUID, Matches } from 'class-validator';

export class RegistrationNotClientDto {
  @IsDefined()
  @IsString()
  @Matches(RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/))
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

  @IsDefined()
  @IsEmail()
  email: string;
}
