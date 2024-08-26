import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Image } from '../entities/image.entity';

@Injectable()
export class ImageRepository extends Repository<Image> {}
