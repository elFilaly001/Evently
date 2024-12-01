import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InscriptionController } from './inscription.controller';
import { InscriptionService } from './inscription.service';
import { InscriptionSchema } from './inscription.schema';
import { AuthGuard } from '../auth/auth.guard';
import { AuthModule } from '../auth/auth.module';
import { AuthMiddleware } from 'src/auth/auth.middleware';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Inscription', schema: InscriptionSchema }
        ]),
        AuthModule
    ],
    providers: [InscriptionService],
    controllers: [InscriptionController],
    exports: [InscriptionService]
})
export class InscriptionModule {
}
