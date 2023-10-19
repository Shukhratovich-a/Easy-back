import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SubcategoryEntity, SubcategoryContentEntity } from '@modules/subcategory/subcategory.entity';
import { ProductEntity, ProductContentEntity, ProductImageEntity } from '@modules/product/product.entity';

import { SubcategoryService } from '@modules/subcategory/subcategory.service';
import { ProductService } from '@modules/product/product.service';

import { CategoryEntity, CategoryContentEntity } from './category.entity';

import { CategoryController } from './category.controller';

import { CategoryService } from './category.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CategoryEntity,
      CategoryContentEntity,
      SubcategoryEntity,
      SubcategoryContentEntity,
      ProductEntity,
      ProductContentEntity,
      ProductImageEntity,
    ]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService, SubcategoryService, ProductService],
})
export class CategoryModule {}
