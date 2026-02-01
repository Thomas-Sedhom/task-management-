import { UserInterface } from './user.interface';

export interface CustomRequest extends Request {
  cookies: {
    accessToken?: string;
    refreshToken?: string;
    [key: string]: any;
  };
  user?: UserInterface;
}
