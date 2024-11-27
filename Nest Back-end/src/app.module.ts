import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { EventModule } from './event/event.module';
import { InscriptionModule } from './inscription/inscription.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    AuthModule,
    EventModule,
    InscriptionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
