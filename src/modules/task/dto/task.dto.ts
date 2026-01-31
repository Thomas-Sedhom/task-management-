import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatusEnum } from '../enum/task-status.enum';

export class TaskDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @ApiProperty({ example: 'title', description: 'Task Title' })
  title: string;
  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  @ApiProperty({ example: 'Description', description: 'Task Description' })
  description: string;
  @IsString({ message: 'Task status must be a string' })
  @IsNotEmpty({ message: 'Task status is required' })
  @ApiProperty({
    enum: TaskStatusEnum,
    example: TaskStatusEnum.PENDING,
  })
  @IsEnum(TaskStatusEnum, {
    message: 'Status must be one of: pending, in_progress, completed',
  })
  status: TaskStatusEnum;
}
