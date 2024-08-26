import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { EntityNotFoundError } from 'typeorm';
import {
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dtos/createProduct.dto';
import { UpdateProductDto } from '../dtos/updateProduct.dto';
import { ProductQueryPaginationDto } from '../dtos/productQueryPagination.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}

  /**
   * Retrieves a list of products based on the provided query parameters.
   *
   * @param {ProductQueryPaginationDto} query - The query parameters for pagination and filtering.
   * @return {Promise<Product[]>} The list of products matching the query parameters.
   */
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'offset',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'category',
    type: String,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'The found products',
    type: [Product],
  })
  @Get()
  async getProducts(
    @Query()
    { limit = 10, offset = 0, category }: ProductQueryPaginationDto,
  ) {
    try {
      return await this.productService.find({ limit, offset, category });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * Retrieves a product by its id.
   *
   * @param {string} id - The id of the product (uuid)
   * @return {Product} The found product
   */
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The id of the product (uiid)',
  })
  @ApiResponse({
    status: 200,
    description: 'The found product',
    type: Product,
  })
  @Get(':id')
  async getProduct(@Param('id') id: string) {
    try {
      return await this.productService.findOne(id);
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new NotFoundException(`Product with id ${id} not found`);
      } else {
        throw new InternalServerErrorException(err.message);
      }
    }
  }

  /**
   * Creates a new product.
   *
   * @param {CreateProductDto} createProductDto - The data transfer object containing the product details.
   * @return {Promise} A promise that resolves to the newly created product.
   */
  @ApiBody({
    type: CreateProductDto,
  })
  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    try {
      return await this.productService.createProduct(createProductDto);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * Updates a product with the given id.
   *
   * @param {string} id - The id of the product to update (uuid).
   * @param {UpdateProductDto} updateProductDto - The data transfer object containing the updated product details.
   * @return {Promise} A promise that resolves to the updated product.
   */
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The id of the product (uiid)',
  })
  @ApiBody({
    type: UpdateProductDto,
  })
  @Patch(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    try {
      return await this.productService.updateProduct(id, updateProductDto);
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new NotFoundException(`Product with id ${id} not found`);
      } else {
        throw new InternalServerErrorException(err.message);
      }
    }
  }

  /**
   * Deletes a product with the given id.
   *
   * @param {string} id - The id of the product to delete (uuid)
   * @return {Promise} A promise that resolves to a success message if the product is deleted successfully
   */
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The id of the product (uiid)',
  })
  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    try {
      await this.productService.deleteProduct(id);
      return { message: 'Product deleted successfully' };
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new NotFoundException(`Product with id ${id} not found`);
      } else {
        throw new InternalServerErrorException(err.message);
      }
    }
  }
}
