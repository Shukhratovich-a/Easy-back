import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductEntity, ProductContentEntity, ProductImageEntity } from './product.entity';

import { ProductController } from './product.controller';

import { ProductService } from './product.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, ProductContentEntity, ProductImageEntity])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
