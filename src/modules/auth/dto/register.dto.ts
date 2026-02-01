import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @ApiProperty({ example: 'Thomas Sedhom', description: 'Full name ' })
  name: string;
  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail()
  @ApiProperty({ example: 'user@gmail.com', description: 'User email' })
  email: string;
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|_<>-])(?=.*[a-zA-Z\d]).{8,}$/, {
    message:
      'Password must be at least 8 characters long, include at least one uppercase letter, and one symbol',
  })
  @ApiProperty({
    example: 'Rm-24222682',
    description: 'User password',
    minLength: 8,
  })
  password: string;
  @IsNotEmpty({ message: 'Age is required' })
  @ApiProperty({ example: 25, description: 'Age of the user' })
  age: number;
}
