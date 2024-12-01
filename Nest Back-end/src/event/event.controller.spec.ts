import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { InscriptionService } from '../inscription/inscription.service';
import { AuthGuard } from '../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

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
            getInscriptions: jest.fn(),
            createInscription: jest.fn(),
            updateInscription: jest.fn(),
            deleteInscription: jest.fn()
          }
        },
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn(),
            verifyAsync: jest.fn()
          }
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-secret')
          }
        },
        AuthGuard
      ]
    }).compile();

    controller = module.get<EventController>(EventController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
