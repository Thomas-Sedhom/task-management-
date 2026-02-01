import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../../modules/auth/auth.service';
import { JwtService } from '../../modules/jwt/jwt.service';
import { CustomRequest } from '../interface/custom-request.interface';

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: CustomRequest = context
      .switchToHttp()
      .getRequest<CustomRequest>();
    const response: Response = context.switchToHttp().getResponse();
    const accessToken = request.cookies['accessToken'];
    const refreshToken = request.cookies['refreshToken'];

    if (!refreshToken)
      throw new UnauthorizedException('No refresh token provided');

    try {
      if (accessToken) {
        this.jwtService.verifyToken(accessToken);
        return true;
      } else {
        throw new UnauthorizedException('Access token missing');
      }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        // eslint-disable-next-line no-useless-catch
        try {
          const newTokens = await this.authService.refreshTokens(refreshToken);

          response.cookie('accessToken', newTokens.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          });

          response.cookie('refreshToken', newTokens.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 60 * 24 * 60 * 60 * 1000, // 2 months
          });

          request.cookies['accessToken'] = newTokens.accessToken;
          return true;
        } catch (refreshError) {
          throw refreshError;
        }
      }

      throw new UnauthorizedException('Invalid access token');
    }
  }
}
