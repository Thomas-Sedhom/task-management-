import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ActionEnum } from '../enum/action.enum';

@Schema({ timestamps: true })
export class Log {
  @Prop({
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Users',
    index: true,
    trim: true,
  })
  userId: mongoose.Types.ObjectId;
  @Prop({
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Tasks',
    index: true,
    trim: true,
  })
  taskId: mongoose.Types.ObjectId;
  @Prop({
    required: true,
    type: String,
    trim: true,
  })
  action: ActionEnum;
  @Prop({
    required: true,
    type: String,
    trim: true,
  })
  IP: string;
  @Prop({
    required: true,
    type: String,
    trim: true,
  })
  user_agent: string;
}

export const LogSchema = SchemaFactory.createForClass(Log);
