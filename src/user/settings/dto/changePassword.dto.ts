import { Matches, IsString, IsDefined, IsUUID, IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
    @IsDefined()
    @IsUUID()
    @IsNotEmpty()
    clientId: number;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    @Matches(RegExp(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,}/g))
    password: string;
}
