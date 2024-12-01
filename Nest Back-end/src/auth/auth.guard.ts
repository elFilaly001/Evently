import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { log } from 'console';
import { Types } from 'mongoose';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private jwtService: JwtService, private configService: ConfigService) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    
    const req = context.switchToHttp().getRequest();
    console.log("token --2-1", req.headers)
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException("Token is missing");
    }
    try {
      const decoded = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET')
      });
      
      // Check if token is expired by comparing current time with exp claim
      // const currentTimestamp = Math.floor(Date.now() / 1000);
      // if (decoded.exp && decoded.exp < currentTimestamp) {
      //   throw new UnauthorizedException("Token has expired");
      // }

      if (!Types.ObjectId.isValid(decoded.sub)) {
        throw new UnauthorizedException("Invalid token");
      }
      return true; 
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
