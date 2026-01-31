import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '../../modules/jwt/jwt.service';
import { CustomRequest } from '../interface/custom-request.interface';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(context: ExecutionContext): boolean {
    const request: CustomRequest = context
      .switchToHttp()
      .getRequest<CustomRequest>();
    const accessToken = request.cookies.accessToken;
    if (!accessToken) {
      throw new UnauthorizedException('No access token provided');
    }
    try {
      const decoded = this.jwtService.verifyToken(accessToken);
      request.user = decoded;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
