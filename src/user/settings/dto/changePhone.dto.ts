
import { Length, IsNumberString, IsDefined, IsUUID, IsNotEmpty } from 'class-validator';

export class ChangeMobilePhoneDto {
    @IsDefined()
    @IsUUID()
    @IsNotEmpty()
    clientId: number;

    @IsDefined()
    @IsNotEmpty()
    @Length(11)
    @IsNumberString()
    mobilePhone: string;
}