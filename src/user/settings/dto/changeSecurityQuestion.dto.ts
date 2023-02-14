import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class ChangeSecurityQuestionDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  securityQuestionAnswer: string;
}
