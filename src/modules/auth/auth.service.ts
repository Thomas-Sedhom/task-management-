import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '../jwt/jwt.service';
import { LoginDto } from './dto/login.dto';
import { comparePass, hashPass } from '../../common/utils/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}
  async register(registerDto: RegisterDto) {
    registerDto.password = await hashPass(registerDto.password);
    const user = await this.userModel.create(registerDto);
    const accessToken = this.jwtService.generateToken(user);
    const refreshToken = this.jwtService.generateRefreshToken(user);
    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
      },
    };
  }
  async login(user: LoginDto) {
    const existingUser = await this.userModel.findOne({ email: user.email });
    if (!existingUser) {
      throw new UnauthorizedException({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await comparePass(
      user.password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException({ message: 'Invalid email or password' });
    }

    const accessToken = this.jwtService.generateToken(existingUser);
    const refreshToken = this.jwtService.generateRefreshToken(existingUser);

    return {
      accessToken,
      refreshToken,
      user: {
        id: existingUser._id,
        email: existingUser.email,
      },
    };
  }
}
