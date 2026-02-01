import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserInterface } from '../auth/interface/user.interface';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { JwtPayload } from './interface/jwt-payload.interface';

@Injectable()
export class JwtService {
  constructor(private readonly jwtService: NestJwtService) {}
  generateToken(info: UserInterface) {
    const id: string | undefined = info._id?.toString();
    const payload = { sub: id, email: info.email };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }
  generateRefreshToken(info: UserInterface) {
    const id: string | undefined = info._id?.toString();
    const payload = { sub: id, email: info.email };
    return this.jwtService.sign(payload, { expiresIn: '60d' });
  }
  verifyToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException({ message: 'Invalid or expired token' });
    }
  }
  setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 604800000, // 7 days
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 60 * 24 * 60 * 60 * 1000, // 2 months
    });
  }
}
