import { IsDefined, IsUUID } from 'class-validator';

export default class sendNotificationSettingsDto {
  @IsDefined()
  @IsUUID()
  clientId: string;
}
