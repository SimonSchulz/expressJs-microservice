import { IsBoolean, IsDefined, IsEmail, IsString, IsUUID, Matches } from 'class-validator';

export class RegistrationDataDto {
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

  @IsDefined()
  @IsString()
  firstName: string;

  @IsDefined()
  @IsString()
  lastName: string;

  @IsDefined()
  @Matches(RegExp(/^([A-Za-z0-9]{6,20})|^(?=.{6,20}$)([A-Za-z0-9]+\s?[A-Za-z0-9]+)$/))
  passportNumber: string;

  @IsBoolean()
  isResident: boolean;
}
