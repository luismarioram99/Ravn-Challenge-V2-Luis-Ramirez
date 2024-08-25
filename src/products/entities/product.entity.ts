import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'money' })
  price: number;

  @Column({ type: 'integer' })
  stock: number;

  @Column({ nullable: true })
  image: string;
}
