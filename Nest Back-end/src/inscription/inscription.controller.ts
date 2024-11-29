import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InscriptionService } from './inscription.service';
import { InscriptionDto } from './inscription.dto';
import { Types } from 'mongoose';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Inscriptions')
@ApiBearerAuth()
@Controller('inscription')
@UseGuards(AuthGuard)
export class InscriptionController {
    constructor(private readonly inscriptionService: InscriptionService) {}
    
    @Post("addInscription")
    @ApiOperation({ summary: 'Create a new inscription' })
    @ApiResponse({ status: 201, description: 'Inscription successfully created', type: InscriptionDto })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async createInscription(@Body() inscription: InscriptionDto): Promise<InscriptionDto> {
        return this.inscriptionService.createInscription(inscription);
    }

    @Get(":id")
    @ApiOperation({ summary: 'Get all inscriptions for an event' })
    @ApiResponse({ status: 200, description: 'Returns all inscriptions', type: [InscriptionDto] })
    @ApiResponse({ status: 404, description: 'Inscriptions not found' })
    async getInscriptions(@Param('id') id: string): Promise<InscriptionDto[]> {
        return this.inscriptionService.getInscriptions(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update an inscription' })
    @ApiResponse({ status: 200, description: 'Inscription updated successfully', type: InscriptionDto })
    @ApiResponse({ status: 404, description: 'Inscription not found' })
    async updateInscription(
        @Param('id') id: string,
        @Body() data: InscriptionDto
    ): Promise<InscriptionDto> {
        return this.inscriptionService.updateInscription(id, data);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an inscription' })
    @ApiResponse({ status: 200, description: 'Inscription deleted successfully' })
    @ApiResponse({ status: 404, description: 'Inscription not found' })
    async deleteInscription(@Param('id') id: string): Promise<InscriptionDto | null> {
        return this.inscriptionService.deleteInscription(id);
    }
}
