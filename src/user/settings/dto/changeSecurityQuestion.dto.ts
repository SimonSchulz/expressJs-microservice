import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class ChangeSecurityQuestionDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  securityQuestionAnswer: string;

  @IsString()
  @IsNotEmpty()
  securityQuestion: string;

  @IsString()
  @IsNotEmpty()
  securityQuestionId: string;
}
