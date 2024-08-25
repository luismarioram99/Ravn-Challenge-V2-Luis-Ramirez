import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import ormconfig from 'ormconfig';

@Module({
  imports: [TypeOrmModule.forRoot(ormconfig), ProductsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
