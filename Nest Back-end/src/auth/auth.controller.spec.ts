import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './auth.dto';
import { BadRequestException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto: RegisterDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const expectedResult = {
        _id: 'someId',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      mockAuthService.register.mockResolvedValue(expectedResult);

      const result = await controller.register(registerDto);

      expect(result).toBe(expectedResult);
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
    });
    it('should throw error if user already exists', async () => {
      const registerDto: RegisterDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const error = new BadRequestException('User already exists');
      mockAuthService.register.mockRejectedValue(error);

      await expect(controller.register(registerDto)).rejects.toThrow(BadRequestException);
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
    });
    it('should throw error if data is invalid', async () => {
      const registerDto: RegisterDto = {
        username: '',
        email: 'invalid-email',
        password: '123', 
      };

      const error = new BadRequestException('Invalid data');
      mockAuthService.register.mockRejectedValue(error);

      await expect(controller.register(registerDto)).rejects.toThrow(BadRequestException);
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    it('should login a user and return token with user data', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const expectedResult = {
        user: {
          username: 'testuser',
          email: 'test@example.com',
        },
        token: 'jwt-token',
      };

      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(loginDto);

      expect(result).toBe(expectedResult);
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    });
    it('should throw error if login data is invalid', async () => {
      const loginDto: LoginDto = {
        email: 'invalid-email',
        password: '123',
      };

      const error = new BadRequestException('Invalid data');
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(loginDto)).rejects.toThrow(BadRequestException);
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    });
  });
});
