import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomExceptionFilter } from '../../common/filter/custom-exception.filter';
import { ResponseInterceptor } from '../../common/interceptor/response.interceptor';
import { TaskDto } from './dto/task.dto';
import { ResponseMessage } from '../../common/decorator/response-message.decorator';
import { User } from '../../common/decorator/user.decorator';
import { UserInterface } from '../../common/interface/user.interface';
import { TaskService } from './task.service';
import { Request } from 'express';
import { TaskStatusEnum } from './enum/task-status.enum';
import { JwtGuard } from '../../common/guard/jwt.guard';
import { JwtRefreshGuard } from '../../common/guard/refresh-jwt.guard';
@ApiTags('Task')
@UseFilters(CustomExceptionFilter)
@UseInterceptors(ResponseInterceptor)
@UseGuards(JwtGuard, JwtRefreshGuard)
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
  @ApiOperation({ summary: 'Create new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: TaskDto })
  @ResponseMessage('Task created successfully')
  @Post()
  async creatTask(
    @Body() taskDto: TaskDto,
    @User() user: UserInterface,
    @Req() req: Request,
  ): Promise<any> {
    const userId = user.sub;
    const ip =
      req.headers['x-forwarded-for']?.toString() ??
      req.socket.remoteAddress ??
      req.ip ??
      'unknown';

    const userAgent = req.headers['user-agent'] || 'unknown';

    return this.taskService.creatTask(userId, taskDto, ip, userAgent);
  }

  @ApiOperation({ summary: 'Update task status' })
  @ApiResponse({ status: 200, description: 'Task status updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({
    schema: {
      properties: {
        taskStatus: { enum: Object.values(TaskStatusEnum) },
      },
    },
  })
  @ResponseMessage('Task status updated successfully')
  @Patch(':taskId/status')
  async updateTaskStatus(
    @Param('taskId') taskId: string,
    @Body('taskStatus') taskStatus: TaskStatusEnum,
    @User() user: UserInterface,
    @Req() req: Request,
  ): Promise<any> {
    const userId = user.sub;

    const ip =
      req.headers['x-forwarded-for']?.toString() ??
      req.socket.remoteAddress ??
      req.ip ??
      'unknown';

    const userAgent = req.headers['user-agent'] ?? 'unknown';

    return this.taskService.updateTaskStatus(
      userId,
      taskId,
      ip,
      userAgent,
      taskStatus,
    );
  }
  @ApiOperation({ summary: 'Delete task' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ResponseMessage('Task deleted successfully')
  @Delete(':taskId')
  async deleteTask(
    @Param('taskId') taskId: string,
    @User() user: UserInterface,
    @Req() req: Request,
  ): Promise<any> {
    const userId = user.sub;

    const ip =
      req.headers['x-forwarded-for']?.toString() ??
      req.socket.remoteAddress ??
      req.ip ??
      'unknown';

    const userAgent = req.headers['user-agent'] ?? 'unknown';

    return this.taskService.deleteTask(userId, taskId, ip, userAgent);
  }

  @ApiOperation({ summary: 'Get all tasks for user' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ResponseMessage('Tasks retrieved successfully')
  @Get()
  async getAllTasksForUser(@User() user: UserInterface): Promise<any> {
    const userId = user.sub;
    return this.taskService.getAllTasksForUser(userId);
  }

  @ApiOperation({ summary: 'Get task by id' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ResponseMessage('Task retrieved successfully')
  @Get('getTask/:taskId')
  async getTaskForUser(
    @Param('taskId') taskId: string,
    @User() user: UserInterface,
  ): Promise<any> {
    const userId = user.sub;
    return this.taskService.getTaskForUser(userId, taskId);
  }

  @ApiOperation({ summary: 'Get all logs for user' })
  @ApiResponse({ status: 200, description: 'Logs retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ResponseMessage('Logs retrieved successfully')
  @Get('logs')
  async getAllLogsForUser(@User() user: UserInterface): Promise<any> {
    const userId = user.sub;
    return this.taskService.getAllLogsForUser(userId);
  }
}
