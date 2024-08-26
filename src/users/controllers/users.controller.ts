import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../dtos/createUser.dto';
import { QueryFailedError } from 'typeorm';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBody({ type: CreateUserDto })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError.code === '23505'
      ) {
        throw new BadRequestException(error.driverError.detail);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
