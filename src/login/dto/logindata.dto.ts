import { IsDefined, IsString, Matches, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDataDto {
  @IsDefined()
  @IsNotEmpty()
  type: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  login: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Matches(
    RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z\!\"\$\&\'\(\)\*\+\,\-\.\:\;\=\[\\\]\^\_\`\{\|\}\~]{8,20}$/)
  )
  password: string;
}
