import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

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
            const inscriptions = await this.inscriptionModel.find({event: id});
            if (!inscriptions) {
                throw new NotFoundException('Inscriptions not found');
            }
            return inscriptions;
        } catch (error) {
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

    async updateInscription(id: string, inscription: Inscription): Promise<Inscription | null> {
        try {
            const updatedInscription = await this.inscriptionModel.findByIdAndUpdate(id, inscription, { new: true });
            if (!updatedInscription) {
                throw new NotFoundException('Inscription not found');
            }
            return updatedInscription;
        } catch (error) {
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
