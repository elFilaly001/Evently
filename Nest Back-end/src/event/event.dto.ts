import { IsString, IsNotEmpty,IsISO8601 } from 'class-validator';
import { Transform} from 'class-transformer';

export class EventDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsISO8601()
    @Transform(({ value }) => new Date(value).toISOString())
    date: Date;

    @IsString()
    @IsNotEmpty()
    location: string;

    @IsString()
    @IsNotEmpty()
    creator: string;
}