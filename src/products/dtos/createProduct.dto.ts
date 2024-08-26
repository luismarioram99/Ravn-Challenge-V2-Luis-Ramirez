import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUrl,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Product name', example: 'Product 1' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Product description',
    example: 'Product 1 Description',
  })
  description: string;

  @IsNumber()
  @IsPositive()
  @ApiProperty({ description: 'Product price', example: '10.00' })
  price: number;

  @IsNumber()
  @IsPositive()
  @ApiProperty({ description: 'Product stock', example: '10' })
  stock: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Product category', example: 'Category 1' })
  category: string;

  @IsOptional()
  @IsUrl()
  @ApiProperty({ description: 'Product image', example: 'http://example.com' })
  image?: string;
}
