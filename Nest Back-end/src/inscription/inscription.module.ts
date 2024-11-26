import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InscriptionController } from './inscription.controller';
import { InscriptionService } from './inscription.service';
import { InscriptionSchema } from './inscription.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Inscription', schema: InscriptionSchema }
        ])
    ],
    providers: [InscriptionService],
    controllers: [InscriptionController],
    exports: [InscriptionService]
})
export class InscriptionModule {}
