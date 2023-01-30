
import { IsEmail, IsString, IsDefined, IsUUID, IsNotEmpty } from 'class-validator';

export class ChangeEmailDto {
    @IsDefined()
    @IsUUID()
    @IsNotEmpty()
    clientId: number;

    @IsDefined()
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email: string;
}