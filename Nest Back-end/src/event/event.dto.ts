import { IsString, IsNotEmpty, IsISO8601 } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class EventDto {
    @ApiProperty({
        example: 'Tech Conference 2024',
        description: 'The title of the event'
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        example: 'Annual technology conference featuring latest innovations',
        description: 'Detailed description of the event'
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        example: '2024-12-31T23:59:59Z',
        description: 'The date and time of the event'
    })
    @IsISO8601()
    @Transform(({ value }) => new Date(value).toISOString())
    date: Date;

    @ApiProperty({
        example: 'Convention Center, City',
        description: 'The location where the event will take place'
    })
    @IsString()
    @IsNotEmpty()
    location: string;

    @ApiProperty({
        example: '507f1f77bcf86cd799439011',
        description: 'The ID of the user who created the event'
    })
    @IsString()
    @IsNotEmpty()
    creator: string;
}