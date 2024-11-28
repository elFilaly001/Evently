import { Test, TestingModule } from '@nestjs/testing';
import { InscriptionController } from './inscription.controller';
import { InscriptionService } from './inscription.service';

describe('InscriptionController', () => {
  let controller: InscriptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InscriptionController],
      providers: [
        {
          provide: InscriptionService,
          useValue: {
            createInscription: jest.fn(),
            getInscriptions: jest.fn()
          }
        }
      ]
    }).compile();

    controller = module.get<InscriptionController>(InscriptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
