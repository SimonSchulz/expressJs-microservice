import { IsDefined, IsNotEmpty, Matches } from 'class-validator';

export class PassportIdDto {
  @IsDefined()
  @IsNotEmpty()
  @Matches(RegExp(/^([A-Za-z0-9]{6,20})|^(?=.{6,20}$)([A-Za-z0-9]+\s?[A-Za-z0-9]+)$/))
  passportId: string;
}
