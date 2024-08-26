import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageRepository } from './repositories/image.repository';
import { Image } from './entities/image.entity';
import { ImageService } from './services/images.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Image]), ConfigModule],
  providers: [ImageRepository, ImageService],
  exports: [ImageService],
})
export class ImagesModule {}
