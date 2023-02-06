import { IsDefined, IsUUID, IsNotEmpty } from 'class-validator';

export class DeactivateUserDto {
  @IsDefined()
  @IsUUID()
  @IsNotEmpty()
  clientId: number;
}
