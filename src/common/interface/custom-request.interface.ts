import { UserInterface } from './user.interface';
import { Request } from 'express';

export interface CustomRequest extends Request {
  cookies: {
    accessToken?: string;
    refreshToken?: string;
    [key: string]: any;
  };
  user?: UserInterface;
}
