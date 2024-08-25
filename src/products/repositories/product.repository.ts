import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductRepository extends Repository<Product> {}
