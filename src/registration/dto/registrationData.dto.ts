import { IsBoolean, IsDefined, IsEmail, IsString, IsUUID, Matches, IsNotEmpty } from 'class-validator';

export class RegistrationDataDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Matches(RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/))
  password: string;

  @IsString()
  @IsNotEmpty()
  securityQuestion: string;

  @IsString()
  @IsNotEmpty()
  securityQuestionType: string;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  securityQuestionId: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  securityQuestionAnswer: string;

  @IsDefined()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsDefined()
  @IsNotEmpty()
  @Matches(RegExp(/^([A-Za-z0-9]{6,20})|^(?=.{6,20}$)([A-Za-z0-9]+\s?[A-Za-z0-9]+)$/))
  passportNumber: string;

  @IsBoolean()
  @IsNotEmpty()
  isResident: boolean;
}
