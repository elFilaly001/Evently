import { Controller, Get, Post, Put, Param, Body, Delete, UseGuards, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { EventService } from './event.service';
import { InscriptionService } from '../inscription/inscription.service';
import { EventDto } from './event.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Response } from 'express';
import * as PDFDocument from 'pdfkit';

@ApiTags('Events')
@ApiBearerAuth()
@Controller('event')
@UseGuards(AuthGuard)
export class EventController {
    constructor(
        private readonly eventService: EventService,
        private readonly inscriptionService: InscriptionService
    ) {}

    @Post("addEvent")
    @ApiOperation({ summary: 'Create a new event' })
    @ApiResponse({ status: 201, description: 'Event successfully created', type: EventDto })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async createEvent(@Body() event: EventDto): Promise<EventDto> {
        return this.eventService.createEvent(event);
    }

    @ApiOperation({ summary: 'Get all events for a user' })
    @ApiResponse({ status: 200, description: 'Returns all events', type: [EventDto] })
    @ApiResponse({ status: 404, description: 'Events not found' })
    @Get(":id")
    async getEvents(@Param('id') id: string): Promise<EventDto[]> {
        return this.eventService.getEvents(id);
    }

    @Put(":id")
    @ApiOperation({ summary: 'Update an event' })
    @ApiResponse({ status: 200, description: 'Event updated successfully', type: EventDto })
    @ApiResponse({ status: 404, description: 'Event not found' })
    async updateEvent(@Param('id') id: string, @Body() event: EventDto): Promise<EventDto> {
        return this.eventService.updateEvent(id, event);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an event' })
    @ApiResponse({ status: 200, description: 'Event deleted successfully' })
    @ApiResponse({ status: 404, description: 'Event not found' })
    async deleteEvent(@Param('id') id: string): Promise<EventDto> {
        return this.eventService.deleteEvent(id);
    }

    @Get('download/:id')
    @ApiOperation({ summary: 'Download event details as PDF' })
    @ApiResponse({ status: 200, description: 'Returns PDF file' })
    @ApiResponse({ status: 404, description: 'Event not found' })
    async downloadEventPDF(@Param('id') id: string, @Res() res: Response) {
        const event = await this.eventService.getEventById(id);
        const inscriptions = await this.inscriptionService.getInscriptionsByEventId(id);
        
        const startX = 30;
        let startY = 230;
        const rowHeight = 25;
        
        const doc = new PDFDocument();
        
        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=event-${id}.pdf`);
        
        doc.pipe(res);
        
        // Event Details
        doc.fontSize(25).text('Event Details', 50, 50);
        doc.fontSize(15).text(`Title: ${event.title}`, 50, 90);
        doc.text(`Description: ${event.description}`, 50, 110);
        doc.text(`Date: ${new Date(event.date).toLocaleDateString()}`, 50, 130);
        doc.text(`Location: ${event.location}`, 50, 150);
        
        // Participants List
        doc.fontSize(25).text('Participants List', 50, 190);
        // Add summary at the bottom
        
        // Calculate column widths based on content
        const nameWidth = 150;  // For longer names
        const emailWidth = 200; // For email addresses
        const phoneWidth = 100; // For phone numbers
        const nidWidth = 100;   // For NID numbers
        
        // Draw table borders and headers
        doc.lineWidth(1);
        
        // Draw header row border
        doc.rect(startX, startY, nameWidth + emailWidth + phoneWidth + nidWidth, rowHeight).stroke();
        
        // Draw header text
        doc.fontSize(12);
        doc.text('Name', startX + 5, startY + 7);
        doc.text('Email', startX + nameWidth + 5, startY + 7);
        doc.text('Phone', startX + nameWidth + emailWidth + 5, startY + 7);
        doc.text('NID', startX + nameWidth + emailWidth + phoneWidth + 5, startY + 7);
        
        // Draw vertical lines for header
        doc.moveTo(startX + nameWidth, startY).lineTo(startX + nameWidth, startY + rowHeight).stroke();
        doc.moveTo(startX + nameWidth + emailWidth, startY).lineTo(startX + nameWidth + emailWidth, startY + rowHeight).stroke();
        doc.moveTo(startX + nameWidth + emailWidth + phoneWidth, startY).lineTo(startX + nameWidth + emailWidth + phoneWidth, startY + rowHeight).stroke();
        
        startY += rowHeight;
        
        // Draw table rows with borders
        inscriptions.forEach((inscription) => {
            // Draw row border
            doc.rect(startX, startY, nameWidth + emailWidth + phoneWidth + nidWidth, rowHeight).stroke();
            
            // Draw cell content
            doc.text(inscription.participant.name, startX + 5, startY + 7, { width: nameWidth - 10 });
            doc.text(inscription.participant.email, startX + nameWidth + 5, startY + 7, { width: emailWidth - 10 });
            doc.text(inscription.participant.phone, startX + nameWidth + emailWidth + 5, startY + 7, { width: phoneWidth - 10 });
            doc.text(inscription.participant.NID, startX + nameWidth + emailWidth + phoneWidth + 5, startY + 7, { width: nidWidth - 10 });
            
            // Draw vertical lines
            doc.moveTo(startX + nameWidth, startY).lineTo(startX + nameWidth, startY + rowHeight).stroke();
            doc.moveTo(startX + nameWidth + emailWidth, startY).lineTo(startX + nameWidth + emailWidth, startY + rowHeight).stroke();
            doc.moveTo(startX + nameWidth + emailWidth + phoneWidth, startY).lineTo(startX + nameWidth + emailWidth + phoneWidth, startY + rowHeight).stroke();
            
            startY += rowHeight;
        });
        
        doc.fontSize(12).text(`Total Participants: ${inscriptions.length}`, startX + 5, startY + 10);
        
        doc.end();
    }
}
