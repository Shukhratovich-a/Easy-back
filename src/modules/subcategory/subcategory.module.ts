import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryEntity, CategoryContentEntity } from '@modules/category/category.entity';
import { ProductEntity, ProductContentEntity, ProductImageEntity } from '@modules/product/product.entity';

import { CategoryService } from '@modules/category/category.service';
import { ProductService } from '@modules/product/product.service';

import { SubcategoryEntity, SubcategoryContentEntity } from './subcategory.entity';

import { SubcategoryController } from './subcategory.controller';

import { SubcategoryService } from './subcategory.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SubcategoryEntity,
      SubcategoryContentEntity,
      CategoryEntity,
      CategoryContentEntity,

      ProductEntity,
      ProductContentEntity,
      ProductImageEntity,
    ]),
  ],
  controllers: [SubcategoryController],
  providers: [SubcategoryService, CategoryService, ProductService],
})
export class SubcategoryModule {}
