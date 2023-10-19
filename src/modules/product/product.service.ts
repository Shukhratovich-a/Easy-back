import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { aliasConvertor } from '@utils/aliasConvertor.util';

import { LanguageEnum } from '@enums/language.enum';

import { ProductEntity, ProductContentEntity, ProductImageEntity } from './product.entity';

import { ProductDto } from './dtos/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity) private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(ProductContentEntity) private readonly productContentRepository: Repository<ProductContentEntity>,
    @InjectRepository(ProductImageEntity) private readonly productImageRepository: Repository<ProductImageEntity>,
  ) {}

  // FIND
  async findAll(language: LanguageEnum) {
    const products = await this.productRepository.find({
      relations: { contents: true, images: true },
      where: { contents: { language } },
    });
    if (!products) return [];

    const newProducts: ProductDto[] = products.map((product) => {
      return this.parseProducts(product);
    });

    return newProducts;
  }

  async findAlias(alias: string, language: LanguageEnum) {
    const product = await this.productRepository.findOne({ where: { contents: { alias } } });

    const content = await this.productContentRepository.findOne({
      where: { product: { id: product.id }, language },
    });

    return { alias: content.alias };
  }

  async findByAlias(alias: string, language: LanguageEnum) {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .innerJoinAndSelect('product.contents', 'content', 'content.language = :language and content.alias = :alias', {
        language,
        alias,
      })
      .leftJoinAndSelect('product.images', 'productImages')
      .where('content.alias = :alias', { alias })
      .getOne();

    if (!product) return null;

    const newProduct = this.parseProducts(product);

    return newProduct;
  }

  // UPDATE
  async updateContent(contentId: number, contentDto, productId: number) {
    return this.productContentRepository.save({
      ...contentDto,
      id: contentId,
      alias: aliasConvertor(contentDto.title, productId),
    });
  }

  // CHECK
  async checkContentById(contentId: number) {
    return this.productContentRepository.findOne({ where: { id: contentId }, relations: { product: true } });
  }

  // PARSERS
  parseProducts(product: ProductEntity) {
    const newProduct: ProductDto = plainToClass(ProductDto, product, { excludeExtraneousValues: true });

    if (product.contents && product.contents.length) {
      newProduct.title = product.contents[0].title;
      newProduct.alias = product.contents[0].alias;
      newProduct.description = product.contents[0].description;
      newProduct.volume = product.contents[0].volume;
    }

    if (product.images && product.images.length) {
      newProduct.images = product.images;
    }

    return newProduct;
  }

  async updateAliases() {
    const contents = await this.productContentRepository.find({ relations: { product: true } });

    const newContents = [];

    for (const content of contents) {
      const newContent = await this.productContentRepository.save({
        id: content.id,
        alias: aliasConvertor(content.title, content.product.id),
      });
      newContent.title = content.title;

      newContents.push(newContent);
    }

    return newContents;
  }
}
