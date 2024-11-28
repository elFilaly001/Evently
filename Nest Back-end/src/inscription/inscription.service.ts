import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { InscriptionDto, } from './inscription.dto';

interface Inscription {
    event: string;
    participant: {
        name: string;
        email: string;
        phone: string;
        NID: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

@Injectable()
export class InscriptionService {
    constructor(@InjectModel('Inscription') private inscriptionModel: Model<Inscription>) {}

    async createInscription(inscription: Inscription): Promise<Inscription> {
        try {
            const existingInscription = await this.inscriptionModel.findOne({
                $and: [
                    { event: inscription.event },
                    { 'participant.NID': inscription.participant.NID }
                ]
            });
            if (existingInscription) {
                console.log(existingInscription);
                throw new BadRequestException('Inscription already exists');
            }else{
                const createdInscription = new this.inscriptionModel(inscription);
                return await createdInscription.save();
            }
            // return existingInscription;
        } catch (error) {
            throw error;
        }
    }

    async getInscriptionsByEventId(eventId: string): Promise<Inscription[]> {
        try {
            const inscriptions = await this.inscriptionModel.find({ event: eventId });
            return inscriptions;
        } catch (error) {
            throw error;
        }
    }

    async getInscriptions(id: string): Promise<Inscription[]> {
        try {
            // Validate if the id is a valid MongoDB ObjectId
            if (!Types.ObjectId.isValid(id)) {
                throw new BadRequestException('Invalid user ID format');
            }

            // Find all inscriptions for events created by this user
            const inscriptions = await this.inscriptionModel
                .aggregate([
                    {
                        $lookup: {
                            from: 'events',
                            localField: 'event',
                            foreignField: '_id',
                            as: 'eventDetails'
                        }
                    },
                    {
                        $match: {
                            'eventDetails.creator': new Types.ObjectId(id)
                        }
                    }
                ]);

            if (!inscriptions || inscriptions.length === 0) {
                throw new NotFoundException('No inscriptions found for events created by this user');
            }

            return inscriptions;
        } catch (error) {
            throw error;
        }
    }

    async getInscriptionById(id: string): Promise<Inscription | null> {
        try {
            const inscription = await this.inscriptionModel.findById(id);
            if (!inscription) {
                throw new NotFoundException('Inscription not found');
            }
            return inscription;
        } catch (error) {
            throw error;
        }
    }




    async updateInscription(id: string, inscription: InscriptionDto): Promise<InscriptionDto | null> {
        try {
            const updatedInscription = await this.inscriptionModel.findByIdAndUpdate(
                id,
                { $set: inscription },
                { new: true }
            );
            if (!updatedInscription) {
                throw new NotFoundException('Inscription not found');
            }
            return updatedInscription;
        } catch (error) {
            throw error;
        }
    }

    async deleteInscription(id: string): Promise<Inscription | null> {
        try {
            const deletedInscription = await this.inscriptionModel.findByIdAndDelete(id);
            if (!deletedInscription) {
                throw new NotFoundException('Inscription not found');
            }
            return deletedInscription;
        } catch (error) {
            throw error;
        }
    }
}
