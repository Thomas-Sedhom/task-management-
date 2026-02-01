import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { CustomRequest } from '../interface/custom-request.interface';

interface RateLimitRecord {
  count: number;
  timestamp: number;
}

@Injectable()
export class RateLimitGuard implements CanActivate {
  private requests = new Map<string, RateLimitRecord>();

  private readonly MAX_REQUESTS = 5;
  private readonly WINDOW_MS = 60 * 1000; // 1 minute

  canActivate(context: ExecutionContext): boolean {
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
      throw new BadRequestException(
        'Too many requests, please try again later',
      );
    }

    record.count++;
    return true;
  }
}
