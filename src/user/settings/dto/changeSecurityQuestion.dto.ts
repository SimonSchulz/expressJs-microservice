import { IsDefined, IsUUID, IsNotEmpty, IsString } from 'class-validator';

export class ChangeSecurityQuestionDto {
    @IsDefined()
    @IsUUID()
    @IsNotEmpty()
    clientId: number;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    securityQuestionAnswer: string;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    securityQuestionType: string;

    @IsString()
    @IsNotEmpty()
    securityQuestionId: string;

    @IsString()
    @IsNotEmpty()
    securityQuestion: string;
}
