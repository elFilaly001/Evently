import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './auth.schema';
import * as bcrypt from 'bcryptjs';
import { RegisterDto, LoginDto, UserResponseDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(@InjectModel('User') private userModel: Model<User>, private jwtService: JwtService) {}

  async register(user: RegisterDto): Promise<User> {
    try {
      const userExists = await this.userModel.findOne({ email: user.email });
      if (userExists) {
        throw new BadRequestException('User already exists');
      } else {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser = new this.userModel({
          ...user,
          password: hashedPassword,
        });
        return newUser.save();
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async login(user: LoginDto): Promise<{user: UserResponseDto, token: string}> {
    try {
      const userExists = await this.userModel.findOne({ email: user.email });
      if (!userExists) {
        throw new BadRequestException('No user found with this email');
      }
      const isPasswordValid = await bcrypt.compare(user.password, userExists.password);
      if (!isPasswordValid) {
        throw new BadRequestException('Please check your password');
      }
      const userResponse: UserResponseDto = {
        id: userExists._id.toString(),
        username: userExists.username,
        email: userExists.email,
      };
      const token = this.jwtService.sign({ 
        sub: userExists._id.toString()
      });
      return {user: userResponse, token};
    } catch (error) {
      console.error( error);
      throw new BadRequestException(error);
    }
  }
}
