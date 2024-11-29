import { IsString, IsNotEmpty, IsObject, IsEmail} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from '@nestjs/swagger';

class ParticipantDto {
    @ApiProperty({
        example: 'John Doe',
        description: 'Full name of the participant'
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: 'john@example.com',
        description: 'Email address of the participant'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: '+1234567890',
        description: 'Phone number of the participant'
    })
    @IsString()
    @IsNotEmpty()
    phone: string;

    @ApiProperty({
        example: '123456789',
        description: 'National ID number of the participant'
    })
    @IsString()
    @IsNotEmpty()
    NID: string;
}

export class InscriptionDto {
    @ApiProperty({
        example: '507f1f77bcf86cd799439011',
        description: 'The ID of the event'
    })
    @IsString()
    @IsNotEmpty()
    event: string;

    @ApiProperty({
        description: 'Participant information',
        type: ParticipantDto
    })
    @IsNotEmpty()
    @IsObject()
    @Type(() => ParticipantDto)
    participant: ParticipantDto;
}

