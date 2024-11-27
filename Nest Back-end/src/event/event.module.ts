import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { EventSchema } from './event.schema';
import { AuthModule } from 'src/auth/auth.module';
import { AuthMiddleware } from 'src/auth/auth.middleware';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Event', schema: EventSchema }]) ,
    AuthModule
],
  providers: [EventService],
  controllers: [EventController]
})
export class EventModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('api/event');
  } 
}
