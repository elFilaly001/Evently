import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { EventSchema } from './event.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Event', schema: EventSchema }])],
  providers: [EventService],
  controllers: [EventController]
})
export class EventModule {}
