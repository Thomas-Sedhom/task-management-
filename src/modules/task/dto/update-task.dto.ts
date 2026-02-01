import { ApiProperty } from '@nestjs/swagger';
import { TaskStatusEnum } from '../enum/task-status.enum';
import { IsEnum } from 'class-validator';

export class UpdateTaskStatusDto {
  @ApiProperty({
    enum: TaskStatusEnum,
    enumName: 'TaskStatusEnum',
    example: TaskStatusEnum.InProgress,
  })
  @IsEnum(TaskStatusEnum)
  taskStatus: TaskStatusEnum;
}
