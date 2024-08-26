import { ApiResponseProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Image } from '../../images/entities/image.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  @ApiResponseProperty({ type: 'string' })
  id: string;

  @Column()
  @ApiResponseProperty({ type: 'string' })
  name: string;

  @Column()
  @ApiResponseProperty({ type: 'string' })
  description: string;

  @Column({ nullable: true })
  @ApiResponseProperty({ type: 'string' })
  category: string;

  @Column({ type: 'money' })
  @ApiResponseProperty({ type: 'number' })
  price: number;

  @Column({ type: 'integer' })
  @ApiResponseProperty({ type: 'number' })
  stock: number;

  @OneToMany(() => Image, (image) => image.product, { onDelete: 'CASCADE' })
  images: Image[];

  @ManyToMany(() => User, (user) => user.likedProducts)
  likers: User[];
}
