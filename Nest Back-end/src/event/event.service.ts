import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventDto } from './event.dto';

interface Event {
    title : string ;
    description : string ;
    date : Date ;
    location : string ;
    creator : string ;
    createdAt?: Date;
    updatedAt?: Date;
}

@Injectable()
export class EventService {
    constructor(@InjectModel('Event') private eventModel: Model<EventDto>) {}

    async createEvent(event: EventDto): Promise<EventDto> {
        try {
            const existingEvent = await this.eventModel.findOne({ $and: [{title: event.title},{date: event.date}, {creator: event.creator}] });
            if (existingEvent) {
                throw new BadRequestException('Event with this title already exists');
            }else{
                const createdEvent = new this.eventModel(event);
                return await createdEvent.save();
            }
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async getEventByTitle(title: string): Promise<EventDto[]> {
        try {
            const event = await this.eventModel.find({title : title});
            if (!event) {
                throw new NotFoundException('Event not found');
            }
            return event;
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async updateEvent(id: string , event: EventDto): Promise<EventDto> {
        try {
            const updatedEvent = await this.eventModel.findByIdAndUpdate(id, event);
            if (!updatedEvent) {
                throw new NotFoundException('Event not found');
            }
            return updatedEvent;
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async deleteEvent(id: string): Promise<EventDto> {
        try {
            const deletedEvent = await this.eventModel.findByIdAndDelete(id);
            if (!deletedEvent) {
                throw new NotFoundException('Event not found');
            }
            return deletedEvent;
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async getEvents(id: string): Promise<EventDto[]> {
        try {
            const events = await this.eventModel.find({creator: id});
            if (!events) {
                throw new NotFoundException('Events not found');
            }
            return events;
        } catch (error) {
            throw new BadRequestException(error);
        }
    }
}
