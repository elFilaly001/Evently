import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

@Schema()
export class User {
  @ApiProperty({
    description: 'The username of the user',
    example: 'john_doe',
  })
  @Prop({ required: true })
  username: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john@example.com',
  })
  @Prop({ required: true })
  email: string;

  @ApiProperty({
    description: 'The hashed password of the user',
    example: 'hashedPassword123',
  })
  @Prop({ required: true })
  password: string;

  @ApiProperty({
    description: 'The timestamp when the user was created',
    example: '2024-03-20T10:00:00.000Z',
  })
  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
