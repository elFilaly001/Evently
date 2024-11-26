import { Controller, Get, Post, Put, Param, Body, Delete } from '@nestjs/common';
import { EventService } from './event.service';
import { EventDto } from './event.dto';

@Controller('api/event')
export class EventController {
    constructor (private readonly eventService:EventService) {}

    @Post("addEvent")
    async createEvent(@Body() event: EventDto): Promise<EventDto> {
        return this.eventService.createEvent(event);
    }

    @Get(":id")
    async getEvents(@Param('id') id: string): Promise<EventDto[]> {
        return this.eventService.getEvents(id);
    }

    // @Get("updateEvent")
    // async getEventById(@Param('id') id: string): Promise<EventDto[]> {
    //     return this.eventService.getEventById(id);
    // }

    @Put(":id")
    async updateEvent(@Param('id') id: string, @Body() event: EventDto): Promise<EventDto> {
        return this.eventService.updateEvent(id, event);
    }

    @Delete(':id')
    async deleteEvent(@Param('id') id: string): Promise<EventDto> {
        return this.eventService.deleteEvent(id);
    }
}
