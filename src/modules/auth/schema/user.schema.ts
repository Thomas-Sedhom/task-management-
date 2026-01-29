import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: true,
    unique: true,
    type: String,
    trim: true,
  })
  email: string;
  @Prop({
    required: true,
    unique: true,
    type: String,
    trim: true,
  })
  password: string;
  @Prop({
    required: true,
    unique: true,
    type: String,
    trim: true,
  })
  name: string;
  @Prop({
    required: true,
    unique: true,
    type: String,
    trim: true,
  })
  age: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
