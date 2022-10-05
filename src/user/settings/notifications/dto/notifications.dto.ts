import { IsBoolean, IsDefined, IsUUID } from 'class-validator';

export class smsNotificationDto {
  @IsDefined()
  @IsUUID()
  clientId: string;

  @IsDefined()
  @IsBoolean()
  notificationStatus: boolean;
}
