import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import ormconfig from 'ormconfig';

@Module({
  imports: [TypeOrmModule.forRoot(ormconfig), ProductsModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
