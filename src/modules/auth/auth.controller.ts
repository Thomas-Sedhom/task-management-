import {
  Body,
  Controller,
  Post,
  UseFilters,
  UseInterceptors,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '../jwt/jwt.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomExceptionFilter } from '../../common/filter/custom-exception.filter';
import { ResponseInterceptor } from '../../common/interceptor/response.interceptor';
import { ResponseMessage } from '../../common/decorator/response-message.decorator';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@UseFilters(CustomExceptionFilter)
@UseInterceptors(ResponseInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'Registration and authentication successful',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ResponseMessage('Registration and authentication successful')
  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    try {
      const { accessToken, refreshToken, user } =
        await this.authService.register(registerDto);
      this.jwtService.setAuthCookies(res, accessToken, refreshToken);
      res.json({
        status: HttpStatus.OK,
        message: 'Registration and authentication successful',
        data: {
          accessToken,
          refreshToken,
          user,
        },
      });
    } catch (err) {
      throw err;
    }
  }
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Authentication successful' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      const { accessToken, refreshToken, user } =
        await this.authService.login(loginDto);

      this.jwtService.setAuthCookies(res, accessToken, refreshToken);

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Login and authentication successful',
        data: {
          accessToken,
          refreshToken,
          user,
        },
      });
    } catch (err) {
      throw err;
    }
  }
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Post('logout')
  logout(@Res() res: Response) {
    try {
      res.clearCookie('accessToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Logout successful',
      });
    } catch (err) {
      throw err;
    }
  }
}
