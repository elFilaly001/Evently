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
            throw new BadRequestException(error);
        }
    }

    async getInscriptions(id: string): Promise<Inscription[]> {
        try {
            // Validate if the id is a valid MongoDB ObjectId
            if (!Types.ObjectId.isValid(id)) {
                throw new BadRequestException('Invalid event ID format');
            }
            
            const inscriptions = await this.inscriptionModel.find({ event: id });
            if (!inscriptions || inscriptions.length === 0) {
                throw new NotFoundException('Inscriptions not found');
            }
            return inscriptions;
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(error);
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
            throw new BadRequestException(error);
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
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(error);
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
            throw new BadRequestException(error);
        }
    }
}
