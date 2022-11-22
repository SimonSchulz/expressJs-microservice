import { IsDefined, IsEmail, IsNumberString, MaxLength, MinLength, Contains } from 'class-validator';

export class EmailDto {
  @IsEmail()
  @IsDefined()
  email: string;
}
