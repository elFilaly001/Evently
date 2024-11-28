import { Test, TestingModule } from '@nestjs/testing';
import { InscriptionService } from './inscription.service';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InscriptionDto } from './inscription.dto';

describe('InscriptionService', () => {
  let service: InscriptionService;
  let model: Model<InscriptionDto>;

  const mockInscription = {
    _id: new Types.ObjectId(),
    event: new Types.ObjectId().toString(),
    participant: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      NID: '12345678'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const MockInscriptionModel = function() {
    this.save = jest.fn().mockResolvedValue(mockInscription);
  } as any;

  MockInscriptionModel.prototype.save = jest.fn().mockResolvedValue(mockInscription);
  MockInscriptionModel.findOne = jest.fn();
  MockInscriptionModel.find = jest.fn();
  MockInscriptionModel.findById = jest.fn();
  MockInscriptionModel.findByIdAndUpdate = jest.fn();
  MockInscriptionModel.findByIdAndDelete = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InscriptionService,
        {
          provide: getModelToken('Inscription'),
          useValue: MockInscriptionModel
        },
      ],
    }).compile();

    service = module.get<InscriptionService>(InscriptionService);
    model = module.get<Model<InscriptionDto>>(getModelToken('Inscription'));
  });

  describe('createInscription', () => {
    it('should create an inscription when it does not exist', async () => {
      MockInscriptionModel.findOne.mockResolvedValue(null);
      const result = await service.createInscription(mockInscription);
      expect(result).toEqual(mockInscription);
    });

    it('should throw BadRequestException when inscription already exists', async () => {
      MockInscriptionModel.findOne.mockResolvedValue(mockInscription);
      await expect(service.createInscription(mockInscription)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getInscriptions', () => {
    it('should return inscriptions for valid event ID', async () => {
      const eventId = new Types.ObjectId().toString();
      MockInscriptionModel.find.mockResolvedValue([mockInscription]);
      const result = await service.getInscriptions(eventId);
      expect(result).toEqual([mockInscription]);
    });

    it('should throw BadRequestException for invalid event ID', async () => {
      await expect(service.getInscriptions('invalid-id')).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when no inscriptions found', async () => {
      const eventId = new Types.ObjectId().toString();
      MockInscriptionModel.find.mockResolvedValue([]);
      await expect(service.getInscriptions(eventId)).rejects.toThrow(NotFoundException);
    });
  });
});