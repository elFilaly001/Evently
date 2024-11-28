import { AuthMiddleware } from './auth.middleware';
import { NextFunction } from 'express';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthMiddleware', () => {
  let middleware: AuthMiddleware;
  let jwtService: JwtService;
  let configService: ConfigService;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    jwtService = {
      verify: jest.fn()
    } as any;
    configService = {
      get: jest.fn().mockReturnValue('someValue')
    } as any;
    nextFunction = jest.fn();
    middleware = new AuthMiddleware(jwtService, configService);
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });
});
