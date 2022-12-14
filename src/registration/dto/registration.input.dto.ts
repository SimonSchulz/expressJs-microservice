import { IsEmail } from 'class-validator';

export class RegistrationInputDto {
  @IsEmail()
  email: string;
}
