import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  url: string;

  @ManyToOne(() => Product, (product) => product.images)
  product: Product;
}
