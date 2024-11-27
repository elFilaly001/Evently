import { IsString, IsNotEmpty, IsObject, IsEmail } from "class-validator";
import { Type } from "class-transformer";
import { ObjectId } from 'mongoose';

class ParticipantDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsNotEmpty()
    NID: string;
}

export class InscriptionDto {
    @IsString()
    @IsNotEmpty()
    event: string;

    @IsNotEmpty()
    @IsObject()
    @Type(() => ParticipantDto)
    participant: ParticipantDto;
}

