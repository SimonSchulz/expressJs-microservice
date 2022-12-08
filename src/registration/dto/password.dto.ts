import { IsDefined, IsNotEmpty, Matches, IsString, IsUUID } from 'class-validator';

export class PasswordDto {
  @IsDefined()
  @IsUUID()
  id: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Matches(RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/))
  password: string;
}