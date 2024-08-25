import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dtos/createProduct.dto';
import { UpdateProductDto } from '../dtos/updateProduct.dto';
import { EntityNotFoundError } from 'typeorm';

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
