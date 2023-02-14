import { Matches, IsString, IsDefined, IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Matches(RegExp(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,}/g))
  password: string;
}
