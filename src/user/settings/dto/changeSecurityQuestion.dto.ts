import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class ChangeSecurityQuestionDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  securityQuestionAnswer: string;

  @IsString()
  @IsNotEmpty()
  securityQuestionType: string;

  @IsString()
  @IsNotEmpty()
  securityQuestionId: string;

  @IsString()
  @IsNotEmpty()
  securityQuestion: string;
}
