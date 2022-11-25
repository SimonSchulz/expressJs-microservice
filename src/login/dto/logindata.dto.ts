import { IsDefined, IsString, Matches, IsNotEmpty } from 'class-validator';

export class LoginDataDto {
  @IsDefined()
  @IsNotEmpty()
  type: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Matches(RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/))
  password: string;
}
