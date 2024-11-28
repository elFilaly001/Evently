import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  
  async use(req: any, res: any, next: () => void) {
    const token = req.headers.authorization?.split('"')[1];

    
    console.log("token",token);

    if (!token) {
      throw new UnauthorizedException("Token is missing");
    }
    try {
      const decoded = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET')
      });
      if (!Types.ObjectId.isValid(decoded.sub)) {
        throw new UnauthorizedException("Invalid token");
      }
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
    next();
  }
}
