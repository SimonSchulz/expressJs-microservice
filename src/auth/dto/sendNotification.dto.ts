import { IsDefined, IsUUID } from 'class-validator';

export class sendNotificationSettingsDto {
  @IsDefined()
  @IsUUID()
  clientId: string;
}
