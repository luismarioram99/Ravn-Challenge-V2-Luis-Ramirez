import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @ApiProperty()
  username: string;

  @IsString()
  @ApiProperty()
  password: string;
}

export class LoginResponseDto {
  @ApiResponseProperty({ type: String })
  access_token: string;
}
