import { ApiResponseProperty } from '@nestjs/swagger';
import { Product } from '../../products/entities/product.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../../commons/enums/roles.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiResponseProperty({ type: 'string' })
  id: string;

  @Column({ unique: true })
  @ApiResponseProperty({ type: 'string' })
  email: string;

  @Column({ unique: true })
  @ApiResponseProperty({ type: 'string' })
  username: string;

  @Column({ default: Role.USER, enum: Role })
  role: Role;

  @Column({ select: false })
  password: string;

  @ManyToMany(() => Product, (product) => product.likers)
  @JoinTable()
  likedProducts: Product[];
}
