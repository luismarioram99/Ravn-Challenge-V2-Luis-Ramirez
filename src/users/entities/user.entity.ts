import { ApiResponseProperty } from '@nestjs/swagger';
import { Product } from 'src/products/entities/product.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiResponseProperty({ type: 'string' })
  id: number;

  @Column({ unique: true })
  @ApiResponseProperty({ type: 'string' })
  email: string;

  @Column({ unique: true })
  @ApiResponseProperty({ type: 'string' })
  username: string;

  @Column({ select: false })
  password: string;

  @ManyToMany(() => Product, (product) => product.likers)
  @JoinTable()
  likedProducts: Product[];
}
