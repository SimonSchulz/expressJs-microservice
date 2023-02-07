import { IsEmail, IsString, IsDefined, IsNotEmpty } from 'class-validator';

export class ChangeEmailDto {
  @IsDefined()
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;
}
