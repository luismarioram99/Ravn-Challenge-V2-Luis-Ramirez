import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  Request,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../dtos/createUser.dto';
import { QueryFailedError } from 'typeorm';
import { Public } from 'src/commons/decorators/isPublic.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Creates a new user based on the provided CreateUserDto.
   *
   * @param {CreateUserDto} createUserDto - The data transfer object containing the user's information.
   * @return {Promise<User>} The newly created user.
   */
  @Public()
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, type: CreateUserDto })
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Request() req: any) {
    try {
      const user = req.user;

      return await this.usersService.create(createUserDto, user);
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
