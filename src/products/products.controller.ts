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
} from '@nestjs/common';
import { ProductsService } from './services/products.service';
import { EntityNotFoundError } from 'typeorm';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dtos/createProduct.dto';
import { UpdateProductDto } from './dtos/updateProduct.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}

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
