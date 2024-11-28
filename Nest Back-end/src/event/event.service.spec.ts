import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { EventDto } from './event.dto';

describe('EventService', () => {
  let service: EventService;
  let model: Model<EventDto>;

  const mockEvent = {
    _id: '507f1f77bcf86cd799439011',
    title: 'Test Event',
    description: 'Test Description',
    date: new Date(),
    location: 'Test Location',
    creator: '507f1f77bcf86cd799439011'
  };

  const MockEventModel = function() {
    this.save = jest.fn().mockResolvedValue(mockEvent);
  } as any;

  MockEventModel.prototype.save = jest.fn().mockResolvedValue(mockEvent);
  MockEventModel.findOne = jest.fn();
  MockEventModel.find = jest.fn();
  MockEventModel.findById = jest.fn();
  MockEventModel.findByIdAndUpdate = jest.fn();
  MockEventModel.findByIdAndDelete = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: getModelToken('Event'),
          useValue: MockEventModel
        },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
    model = module.get<Model<EventDto>>(getModelToken('Event'));
  });

  describe('createEvent', () => {
    it('should create an event successfully', async () => {
      MockEventModel.findOne.mockResolvedValue(null);
      const result = await service.createEvent(mockEvent);
      expect(result).toEqual(mockEvent);
    });

    it('should throw BadRequestException when event already exists', async () => {
      MockEventModel.findOne.mockResolvedValue(mockEvent);
      await expect(service.createEvent(mockEvent)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getEvents', () => {
    it('should return all events', async () => {
      MockEventModel.find.mockResolvedValue([mockEvent]);
      const result = await service.getEvents('someId');
      expect(result).toEqual([mockEvent]);
    });

    it('should throw NotFoundException when no events exist', async () => {
      MockEventModel.find.mockResolvedValue(null);
      await expect(service.getEvents('someId')).rejects.toThrow(NotFoundException);
    });
  });
});