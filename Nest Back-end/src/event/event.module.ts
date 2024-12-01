import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { EventSchema } from './event.schema';
import { InscriptionModule } from '../inscription/inscription.module';
import { InscriptionSchema } from '../inscription/inscription.schema';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Event', schema: EventSchema },
      { name: 'Inscription', schema: InscriptionSchema }
    ]),
    InscriptionModule,
    AuthModule
  ],
  providers: [EventService],
  controllers: [EventController],
  exports: [EventService]
})
export class EventModule{
  
}
