import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError } from 'typeorm';

import { CreateProductDto } from '../dtos/createProduct.dto';
import { ProductQueryPaginationDto } from '../dtos/productQueryPagination.dto';
import { UpdateProductDto } from '../dtos/updateProduct.dto';
import { Product } from '../entities/product.entity';
import { ProductRepository } from '../repositories/product.repository';

/**
 * Constructs a new instance of the ProductsService class.
 *
 * @param {ProductRepository} productRepository - the repository for products
 */
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: ProductRepository,
  ) {}

  /**
   * Retrieves a list of products based on the provided pagination and category parameters.
   *
   * @param {ProductQueryPaginationDto} - An object containing pagination and category details.
   * @param {number} limit - The maximum number of products to return.
   * @param {number} offset - The number of products to skip before starting to return products.
   * @param {string} category - The category of products to return. If not provided, all products are returned.
   * @return {Promise<Product[]>} A promise that resolves to an array of products matching the provided criteria.
   */
  async find({ limit, offset, category }: ProductQueryPaginationDto) {
    if (!category) {
      return this.productRepository.find({ take: limit, skip: offset });
    }

    return this.productRepository.find({
      where: { category },
      take: limit,
      skip: offset,
    });
  }

  /**
   * Retrieves a product by its unique identifier.
   *
   * @param {string} id - the unique identifier of the product to retrieve
   * @return {Promise<Product>} the product with the specified identifier
   */
  async findOne(id: string) {
    return this.productRepository.findOneByOrFail({ id });
  }

  /**
   * Creates a new product based on the provided create product DTO.
   *
   * @param {CreateProductDto} createProductDto - the DTO containing the product details to create
   * @return {Promise<Product>} the newly created product
   */
  async createProduct(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);
    await this.productRepository.save(product);
    return product;
  }

  /**
   * Updates a product with the specified ID using the provided update product DTO.
   *
   * @param {string} id - The ID of the product to update.
   * @param {UpdateProductDto} updateProductDto - The DTO containing the updated product details.
   * @return {Promise<Product>} The updated product.
   * @throws {EntityNotFoundError} If the product with the specified ID does not exist.
   */
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

  /**
   * Deletes a product with the specified ID.
   *
   * @param {string} id - The ID of the product to delete.
   * @return {void} No return value, throws an error if the product does not exist.
   */
  async deleteProduct(id: string) {
    const result = await this.productRepository.delete(id);

    if (result.affected === 0) {
      throw new EntityNotFoundError(Product, id);
    }

    return;
  }
}
