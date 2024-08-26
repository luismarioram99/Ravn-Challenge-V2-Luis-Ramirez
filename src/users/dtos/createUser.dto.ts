import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({ example: 'vW5zA@example.com' })
  email: string;

  @IsString()
  @ApiProperty({ example: 'kamilmysliwiec' })
  username: string;

  @IsString()
  @ApiProperty({ example: 'kamilmysliwiecPass' })
  password: string;
}
