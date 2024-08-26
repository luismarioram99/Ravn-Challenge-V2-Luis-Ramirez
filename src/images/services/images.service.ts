import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageRepository } from '../repositories/image.repository';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { Image } from '../entities/image.entity';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private imageRepository: ImageRepository,
    private configService: ConfigService,
  ) {
    cloudinary.config({
      cloud_name: configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: configService.get('CLOUDINARY_API_KEY'),
      api_secret: configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  /**
   * Uploads an image to Cloudinary using the provided file.
   *
   * @param {Express.Multer.File} file - the file to be uploaded
   * @return {Promise<any>} the result of the upload operation
   */
  async uploadImage(file: Express.Multer.File): Promise<any> {
    const result = await new Promise((resolve, rejects) => {
      cloudinary.uploader
        .upload_stream((error, uploadResult) => {
          if (error) {
            return rejects(new Error('Failed to upload image to Cloudinary'));
          }

          return resolve(uploadResult);
        })
        .end(file.buffer);
    });

    return result;
  }

  /**
   * Creates a new image and saves it to the database.
   *
   * @param {string} url - The URL of the image.
   * @param {Product} product - The product associated with the image.
   * @return {Promise<Image>} A promise that resolves to the newly created image.
   */
  async create(url, product: Product) {
    const image = this.imageRepository.create({ url, product });

    return await this.imageRepository.save(image);
  }
}
