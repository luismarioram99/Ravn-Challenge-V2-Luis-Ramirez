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
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EntityNotFoundError } from 'typeorm';
import { Public } from '../../commons/decorators/isPublic.decorator';
import { Roles } from '../../commons/decorators/roles.decorator';
import { Role } from '../../commons/enums/roles.enum';
import { CreateProductDto } from '../dtos/createProduct.dto';
import { ProductQueryPaginationDto } from '../dtos/productQueryPagination.dto';
import { UpdateProductDto } from '../dtos/updateProduct.dto';
import { Product } from '../entities/product.entity';
import { ProductsService } from '../services/products.service';

@ApiTags('products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}

  /**
   * Retrieves a list of products based on the provided query parameters.
   *
   * @param {ProductQueryPaginationDto} query - The query parameters for pagination and filtering.
   * @return {Promise<Product[]>} The list of products matching the query parameters.
   */
  @Public()
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
  @Public()
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
  @Roles(Role.ADMIN)
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
  @Roles(Role.ADMIN)
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
  @Roles(Role.ADMIN)
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

  /**
   * Uploads an image for a product with the given id.
   *
   * @param {Express.Multer.File} file - The image file to be uploaded
   * @param {string} id - The id of the product to which the image belongs
   * @return {Promise} A promise that resolves to the result of the image upload
   */
  @ApiTags('images')
  @Post(':id/img')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', type: 'string', description: 'Product ID' })
  @ApiBody({
    description: 'Image file',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Image successfully processed' })
  @ApiResponse({ status: 400, description: 'Invalid file format' })
  @Roles(Role.ADMIN)
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id,
  ) {
    try {
      return await this.productService.uploadImage(file, id);
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new NotFoundException(`Product with id ${id} not found`);
      } else {
        throw new InternalServerErrorException(err.message);
      }
    }
  }

  /**
   * Likes a product by adding a user to its likers list.
   *
   * @param {string} id - The ID of the product to like.
   * @param {any} req - The request object containing the user information.
   * @return {Promise<void>} No return value, throws an error if the product or user does not exist.
   */
  @Post(':id/like')
  @ApiParam({ name: 'id', type: 'string', description: 'Product ID' })
  async likeProduct(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.userId;

    try {
      return await this.productService.likeProduct(id, userId);
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new NotFoundException(`Product with id ${id} not found`);
      } else {
        throw new InternalServerErrorException(err.message);
      }
    }
  }
}
