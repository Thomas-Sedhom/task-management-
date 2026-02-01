import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { CustomRequest } from '../interface/custom-request.interface';
import { JwtService } from '@nestjs/jwt';
import { TaskService } from '../../modules/task/task.service';

interface RateLimitRecord {
  count: number;
  timestamp: number;
}

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private readonly taskService: TaskService) {
  }
  private requests = new Map<string, RateLimitRecord>();

  private readonly MAX_REQUESTS = 5;
  private readonly WINDOW_MS = 60 * 1000; // 1 minute

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<CustomRequest>();

    const key = request.user?.sub ?? 'unknown';

    const now = Date.now();
    const record = this.requests.get(key);

    if (!record) {
      this.requests.set(key, { count: 1, timestamp: now });
      return true;
    }

    if (now - record.timestamp > this.WINDOW_MS) {
      this.requests.set(key, { count: 1, timestamp: now });
      return true;
    }

    if (record.count >= this.MAX_REQUESTS) {
      const ip =
        request.headers['x-forwarded-for']?.toString() ??
        request.socket.remoteAddress ??
        request.ip ??
        'unknown';

      const userAgent = request.headers['user-agent'] ?? 'unknown';

      const taskIdParam = request.params.taskId;

      if (Array.isArray(taskIdParam)) {
        throw new BadRequestException('Invalid taskId');
      }

      await this.taskService.rateLimitingLog(
        request.user?.sub || 'unknown',
        taskIdParam,
        ip,
        userAgent,
      );
      throw new BadRequestException(
        'Too many requests, please try again later',
      );
    }

    record.count++;
    return true;
  }
}
