import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { TaskStatusEnum } from '../enum/task-status.enum';

@Schema({ timestamps: true })
export class Task {
  @Prop({
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
    index: true,
    trim: true,
  })
  userId: mongoose.Types.ObjectId;
  @Prop({
    required: true,
    type: String,
    trim: true,
  })
  title: string;
  @Prop({
    required: true,
    type: String,
    trim: true,
  })
  description: string;
  @Prop({
    required: true,
    type: String,
    trim: true,
  })
  status: TaskStatusEnum;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
