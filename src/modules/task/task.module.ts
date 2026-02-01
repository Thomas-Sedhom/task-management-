import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './schema/task.schema';
import { Log, LogSchema } from './schema/log.schema';
import { JwtModule } from '../jwt/jwt.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [TaskController],
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),
    JwtModule,
    AuthModule,
  ],
  providers: [TaskService],
})
export class TaskModule {}
