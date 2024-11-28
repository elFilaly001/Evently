import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { log } from 'console';
import { Types } from 'mongoose';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {

  // constructor(private jwtService: JwtService) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    
      return true; 
  }
}
