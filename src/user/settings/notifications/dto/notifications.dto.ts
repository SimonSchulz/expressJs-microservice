import { IsBoolean, IsDefined, IsUUID } from 'class-validator';

export class smsNotificationDto {
  @IsDefined()
  @IsUUID()
  clientId: string;

  @IsDefined()
  @IsBoolean()
  smsNotification: boolean;

  @IsDefined()
  @IsBoolean()
  pushNotification: boolean;

  @IsDefined()
  @IsBoolean()
  emailSubscription: boolean;
}
