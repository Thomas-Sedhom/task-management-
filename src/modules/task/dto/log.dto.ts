import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ActionEnum } from '../enum/action.enum';

export class LogDto {
  @IsString({ message: 'IP must be a string' })
  @IsNotEmpty({ message: 'IP is required' })
  IP: string;
  @IsString({ message: 'User agent must be a string' })
  @IsNotEmpty({ message: 'User agent is required' })
  user_agent: string;
  @IsString({ message: 'Action must be a string' })
  @IsNotEmpty({ message: 'Action is required' })
  @IsEnum(ActionEnum)
  action: ActionEnum;
}
