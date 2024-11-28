import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { InscriptionService } from '../inscription/inscription.service';

describe('EventController', () => {
  let controller: EventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [
        {
          provide: EventService,
          useValue: {
            createEvent: jest.fn(),
            getEvents: jest.fn(),
            updateEvent: jest.fn(),
            deleteEvent: jest.fn()
          }
        },
        {
          provide: InscriptionService,
          useValue: {
            getInscriptions: jest.fn()
          }
        }
      ]
    }).compile();

    controller = module.get<EventController>(EventController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
