import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}  

  @Post('register')
  register(@Body() user: RegisterDto) {
    return this.authService.register(user);
  }

  @Post('login')
  login(@Body() user: LoginDto) {
    return this.authService.login(user);
  }
}
