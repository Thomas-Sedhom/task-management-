import { Injectable } from '@nestjs/common';
import { TaskDto } from './dto/task.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Task } from './schema/task.schema';
import { Log } from './schema/log.schema';
import { LogDto } from './dto/log.dto';
import { ActionEnum } from './enum/action.enum';
import { TaskStatusEnum } from './enum/task-status.enum';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
    @InjectModel(Log.name) private readonly logModel: Model<Log>,
  ) {}
  async creatTask(
    userId: string,
    taskDto: TaskDto,
    IP: string,
    user_agent: string,
  ) {
    const action = ActionEnum.TASK_CREATED;
    const logDto: LogDto = { IP, user_agent, action };
    const id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(userId);
    const task = await this.taskModel.create({ userId: id, ...taskDto });
    await this.logModel.create({ userId: id, taskId: task._id, ...logDto });
    return task;
  }
  async updateTaskStatus(
    userId: string,
    taskId: string,
    IP: string,
    user_agent: string,
    taskStatus: TaskStatusEnum,
  ) {
    const task_id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
      taskId,
    );
    const user_id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
      userId,
    );
    const task = await this.taskModel.findByIdAndUpdate(task_id, {
      status: taskStatus,
    });
    const action = ActionEnum.TASK_UPDATED;
    const logDto: LogDto = { IP, user_agent, action };
    await this.logModel.create({ userId: user_id, taskId: task_id, ...logDto });
    return task;
  }
  async deleteTask(
    userId: string,
    taskId: string,
    IP: string,
    user_agent: string,
  ) {
    const task_id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
      taskId,
    );
    const user_id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
      userId,
    );
    const task = await this.taskModel.deleteOne(task_id);
    const action = ActionEnum.TASK_DELETED;
    const logDto: LogDto = { IP, user_agent, action };
    await this.logModel.create({ userId: user_id, taskId: task_id, ...logDto });
    return task;
  }
  async getAllTasksForUser(userId: string) {
    const id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(userId);
    const tasks = await this.taskModel.find({ userId: id });
    return tasks;
  }
  async getTaskForUser(userId: string, taskId: string) {
    const task_id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
      taskId,
    );
    const user_id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
      userId,
    );
    const task = await this.taskModel.find({ _id: task_id, userId: user_id });
    return task;
  }
  async getAllLogsForUser(userId: string) {
    const user_id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
      userId,
    );
    const logs = await this.logModel.find({ userId: user_id });
    return logs;
  }

  async rateLimitingLog(
    userId: string,
    taskId: string,
    IP: string,
    user_agent: string,
  ){
    const task_id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
      taskId,
    );
    const user_id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
      userId,
    );
    const action = ActionEnum.RATE_LIMIT_EXCEEDED;
    const logDto: LogDto = { IP, user_agent, action };
    await this.logModel.create({ userId: user_id, taskId: task_id, ...logDto });
  }
}
