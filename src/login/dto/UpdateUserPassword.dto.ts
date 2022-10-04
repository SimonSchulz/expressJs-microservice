import { IsDefined, IsNumberString, IsString, Length, Matches } from 'class-validator';

export class UpdateUserPasswordDto {
  @IsDefined()
  @IsString()
  @Length(11)
  @IsNumberString()
  mobilePhone: string;

  @IsDefined()
  @IsString()
  @Matches(RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/))
  newPassword: string;

  @IsDefined()
  @IsString()
  @Matches(RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/))
  oldPassword: string;
}
