import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsString,
  IsUUID,
  Matches,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';

export class RegistrationDataDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Matches(
    RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z\!\"\$\&\'\(\)\*\+\,\-\.\:\;\=\[\\\]\^\_\`\{\|\}\~]{8,20}$/)
  )
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  @Matches(
    RegExp(/^[0-9a-zA-Z\!\"\$\&\'\(\)\*\+\,\-\.\:\;\=\[\\\]\^\_\`\{\|\}\~]+(?:\s[0-9a-zA-Z\!\"\$\&\'\(\)\*\+\,\-\.\:\;\=\[\\\]\^\_\`\{\|\}\~]+)*$/)
  )
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
  @MinLength(2)
  @MaxLength(50)
  @Matches(
    RegExp(/^[0-9a-zA-Z\!\"\$\&\'\(\)\*\+\,\-\.\:\;\=\[\\\]\^\_\`\{\|\}\~]+(?:\s[0-9a-zA-Z\!\"\$\&\'\(\)\*\+\,\-\.\:\;\=\[\\\]\^\_\`\{\|\}\~]+)*$/)
  )
  securityQuestionAnswer: string;

  @IsDefined()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(RegExp(/(?=.*[A-Z])(?=.*[a-z])[a-zA-Z'\s\-]+$/))
  firstName: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(RegExp(/(?=.*[A-Z])(?=.*[a-z])[a-zA-Z'\s\-]+$/))
  lastName: string;

  @IsDefined()
  @IsNotEmpty()
  @Matches(RegExp(/^(?=.{6,20}$)([0-9A-Za-z]{1,}[A-Za-z0-9\-\s]{0,}[0-9A-Za-z]{1,})?$/))
  passportNumber: string;

  @IsBoolean()
  @IsNotEmpty()
  isResident: boolean;
}
