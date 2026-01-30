import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '../../modules/jwt/jwt.service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.cookies['accessToken'];
    if (!accessToken) {
      throw new UnauthorizedException('No access token provided');
    }
    try {
      const decoded = await this.jwtService.verifyToken(accessToken);
      request.user = decoded;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid access token');
    }
  }
}