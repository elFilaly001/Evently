import { Controller, Get, Param, Post, Body, Put, Delete, BadRequestException, NotFoundException } from '@nestjs/common';
import { InscriptionService } from './inscription.service';
import { InscriptionDto} from './inscription.dto';
import { Types } from 'mongoose';

@Controller('api/inscription')
export class InscriptionController {
    constructor(private readonly inscriptionService: InscriptionService) {}
    
    @Post("addInscription")
    async createInscription(@Body() inscription: InscriptionDto): Promise<InscriptionDto> {
        try {
            const createdInscription = await this.inscriptionService.createInscription(inscription);
            if (!createdInscription) {
                throw new BadRequestException('Failed to create inscription');
            }
            return createdInscription;
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    @Get(":id")
    async getInscriptions(@Param('id') id: string): Promise<InscriptionDto[]> {
        try {
            const inscriptions = await this.inscriptionService.getInscriptions(id);
            if (!inscriptions) {
                throw new NotFoundException('Inscriptions not found');
            }
            return inscriptions;
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    // @Get(':id')
    // async getInscriptionById(@Param('id') id: string): Promise<InscriptionDto | null> {
    //     try {
    //         const inscription = await this.inscriptionService.getInscriptionById(id);
    //         if (!inscription) {
    //             throw new NotFoundException('Inscription not found');
    //         }
    //         return inscription;
    //     } catch (error) {
    //         throw new BadRequestException(error);
    //     }
    // }

    @Put(':id')
    async updateInscription(
        @Param('id') id: string,
        @Body() data: InscriptionDto
    ): Promise<InscriptionDto> {
        try {
            if (!Types.ObjectId.isValid(id)) {
                throw new BadRequestException('Invalid inscription ID format');
            }
            const updatedInscription = await this.inscriptionService.updateInscription(id, data);
            if (!updatedInscription) {
                throw new NotFoundException('Inscription not found');
            }
            return updatedInscription;
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(error);
        }
    }

    @Delete(':id')
    async deleteInscription(@Param('id') id: string): Promise<InscriptionDto | null> {
        try {
            const deletedInscription = await this.inscriptionService.deleteInscription(id);
            if (!deletedInscription) {
                throw new NotFoundException('Inscription not found');
            }
            return deletedInscription;
        } catch (error) {
            throw error;
        }
    }
}
