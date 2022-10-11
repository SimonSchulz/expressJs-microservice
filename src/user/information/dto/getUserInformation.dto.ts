import { IsDefined, IsUUID } from 'class-validator';

export default class SendUserDataDto {
  @IsDefined()
  @IsUUID()
  clientId: string;
}
