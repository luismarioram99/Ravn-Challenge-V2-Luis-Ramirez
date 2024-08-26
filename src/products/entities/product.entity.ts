import { ApiResponseProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ nullable: true })
  @ApiResponseProperty({ type: 'number', example: 'www.example.com' })
  image: string;
}
