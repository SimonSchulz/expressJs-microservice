import { IsDefined, IsNumberString, MaxLength, MinLength, Contains } from 'class-validator';

export class EmailDto {
  @Contains('@')
  @IsDefined()
  email: string;
}
