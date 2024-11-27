import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}
  
  async use(req: any, res: any, next: () => void) {
    const token = req.authToken;

    try {
      const decoded = await this.jwtService.verifyAsync(token);
      if (!decoded || !Types.ObjectId.isValid(decoded.sub)) {
        throw new UnauthorizedException("Invalid token");
      }
      
      delete req.authToken;
      next();
    } catch (error) {
      throw error;
    }
  }
}
