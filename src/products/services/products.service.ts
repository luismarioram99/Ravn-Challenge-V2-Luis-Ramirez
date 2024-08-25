import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dtos/createProduct.dto';
import { UpdateProductDto } from '../dtos/updateProduct.dto';
import { EntityNotFoundError } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: ProductRepository,
  ) {}

  async findOne(id: string) {
    return this.productRepository.findOneByOrFail({ id });
  }

  async createProduct(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);
    await this.productRepository.save(product);
    return product;
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id,
      ...updateProductDto,
    });

    if (!product) {
      throw new EntityNotFoundError(Product, id);
    }

    await this.productRepository.save(product);

    return product;
  }

  async deleteProduct(id: string) {
    const result = await this.productRepository.delete(id);

    if (result.affected === 0) {
      throw new EntityNotFoundError(Product, id);
    }

    return;
  }
}
