import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Role } from '../../commons/enums/roles.enum';

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

  @IsString()
  @IsOptional()
  @ApiProperty({ example: Role.USER })
  role: Role = Role.USER;
}
