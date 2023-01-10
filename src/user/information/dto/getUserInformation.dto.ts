import { IsDefined, MinLength } from 'class-validator';

export default class SendUserDataDto {
  @IsDefined()
  @MinLength(6)
  passportId: string;
}
