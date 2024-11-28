import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventDto } from './event.dto';
import { InscriptionDto } from 'src/inscription/inscription.dto';

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
    constructor(@InjectModel('Event') private eventModel: Model<EventDto> , @InjectModel('Inscription') private inscriptionModel: Model<InscriptionDto>) {}

    async createEvent(event: EventDto): Promise<EventDto> {
        try {
            const existingEvent = await this.eventModel.findOne({ $and: [{title: event.title},{date: event.date}, {creator: event.creator}] });
            if (existingEvent) {
                throw new BadRequestException('Event with this title already exists');
            }
                const createdEvent = new this.eventModel(event);
                return await createdEvent.save();
            
        } catch (error) {
            throw error;
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
            throw error;
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
            throw error;
        }
    }

    async deleteEvent(id: string): Promise<EventDto> {
        try {
            // Then delete the event
            const deletedEvent = await this.eventModel.findByIdAndDelete(id);
            // Delete associated inscriptions first
            await this.inscriptionModel.deleteMany({ event: id });
            if (!deletedEvent) {
                throw new NotFoundException('Event not found');
            }
            return deletedEvent;
        } catch (error) {
            throw error;
        }
    }

    async getEvents(id: string): Promise<EventDto[]> {
        try {
            const events = await this.eventModel.find({creator: id});
            if (!events || events.length === 0) {
                throw new NotFoundException('Events not found');
            }
            return events;
        } catch (error) {
            throw error;
        }
    }
}
