import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';

import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from '../dtos/createUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: UserRepository,
  ) {}

  /**
   * Creates a new user with the provided information and saves it to the database.
   *
   * @param {CreateUserDto} createUserDto - The data transfer object containing the user's information.
   * @return {Promise<User>} The newly created user without the password field.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password } = createUserDto;

    const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
    const hashedPassword = await hash(password, saltRounds);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    delete user.password;

    return user;
  }

  /**
   * Retrieves a user from the database based on the provided identifier.
   *
   * @param {string} identifier - The email or username of the user to find.
   * @return {Promise<User>} The user entity if found, or undefined if not found.
   */
  async findUser(identifier: string): Promise<User | null> {
    //identifier is either email or username

    return this.userRepository.findOne({
      where: [{ email: identifier }, { username: identifier }],
      select: ['id', 'email', 'username', 'password', 'role'],
    });
  }

  /**
   * Retrieves a user from the database by their unique identifier.
   *
   * @param {string} id - The unique identifier of the user to find.
   * @return {Promise<User>} The user entity if found.
   */
  async findUserById(id: string): Promise<User> {
    return this.userRepository.findOneOrFail({
      where: { id },
    });
  }
}
