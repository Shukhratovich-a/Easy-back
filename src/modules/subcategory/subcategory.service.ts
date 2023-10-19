import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { aliasConvertor } from '@utils/aliasConvertor.util';

import { LanguageEnum } from '@enums/language.enum';

import { ProductService } from '@modules/product/product.service';

import { SubcategoryEntity, SubcategoryContentEntity } from './subcategory.entity';

import { SubcategoryDto } from './dtos/subcategory.dto';
import { CreateSubcategoryDto, CreateSubcategoryContentDto } from './dtos/create-subcategory.dto';
import { UpdateSubcategoryDto, UpdateSubcategoryContentDto } from './dtos/update-subcategory.dto';

@Injectable()
export class SubcategoryService {
  constructor(
    @InjectRepository(SubcategoryEntity)
    private readonly subcategoryRepository: Repository<SubcategoryEntity>,
    @InjectRepository(SubcategoryContentEntity)
    private readonly subcategoryContentRepository: Repository<SubcategoryContentEntity>,
    private readonly productService: ProductService,
  ) {}

  // FIND
  async findAll(language?: LanguageEnum) {
    const subcategories = await this.subcategoryRepository.find({
      relations: { contents: true, products: true },
      where: { contents: { language } },
    });
    if (!subcategories) return [];

    const newSubcategories: SubcategoryDto[] = subcategories.map((subcategory) => {
      return this.parseSubcategory(subcategory);
    });

    return newSubcategories;
  }

  async findAllWithProducts(language?: LanguageEnum) {
    const subcategories = await this.subcategoryRepository
      .createQueryBuilder('subcategories')
      .innerJoinAndSelect('subcategories.contents', 'content', 'content.language = :language', { language })
      .leftJoinAndSelect('subcategories.products', 'products')
      .leftJoinAndSelect('products.contents', 'productsContent', 'productsContent.language = :language', { language })
      .leftJoinAndSelect('products.images', 'productImages')
      .getMany();

    const newSubcategories: SubcategoryDto[] = subcategories.map((subcategory) => {
      const newSubcategory = this.parseSubcategory(subcategory);

      if (subcategory.products) {
        newSubcategory.products = subcategory.products.map((product) => {
          return this.productService.parseProducts(product);
        });
      }

      return newSubcategory;
    });

    return newSubcategories;
  }

  async findById(subcategoryId: number, language?: LanguageEnum) {
    const subcategory = await this.subcategoryRepository
      .createQueryBuilder('subcategory')
      .innerJoinAndSelect('subcategory.contents', 'content', 'content.language = :language', { language })
      .leftJoinAndSelect('subcategory.products', 'products')
      .leftJoinAndSelect('products.contents', 'productsContent', 'productsContent.language = :language', { language })
      .leftJoinAndSelect('products.images', 'productImages')
      .where('subcategory.id = :subcategoryId', { subcategoryId })
      .getOne();

    if (!subcategory) return null;

    const newCategory = this.parseSubcategory(subcategory);

    newCategory.products = subcategory.products.map((product) => {
      return this.productService.parseProducts(product);
    });

    return newCategory;
  }

  async findByUUID(subcategoryUUID: number, language?: LanguageEnum) {
    const subcategory = await this.subcategoryRepository
      .createQueryBuilder('subcategory')
      .innerJoinAndSelect('subcategory.contents', 'content', 'content.language = :language', { language })
      .leftJoinAndSelect('subcategory.products', 'products')
      .leftJoinAndSelect('products.contents', 'productsContent', 'productsContent.language = :language', { language })
      .where('subcategory.uuid = :subcategoryUUID', { subcategoryUUID })
      .getOne();

    if (!subcategory) return null;

    const newCategory = this.parseSubcategory(subcategory);

    newCategory.products = subcategory.products.map((product) => {
      return this.productService.parseProducts(product);
    });

    return newCategory;
  }

  async findAlias(id: number, language: LanguageEnum) {
    const content = await this.subcategoryContentRepository.findOne({
      where: { subcategory: { id }, language },
    });

    return { alias: content.alias };
  }

  async findByAlias(alias: string, language: LanguageEnum) {
    const category = await this.subcategoryRepository
      .createQueryBuilder('subcategory')
      .innerJoinAndSelect(
        'subcategory.contents',
        'content',
        'content.language = :language and content.alias = :alias',
        {
          language,
          alias,
        },
      )
      .leftJoinAndSelect('subcategory.products', 'products')
      .leftJoinAndSelect('products.contents', 'productsContent', 'productsContent.language = :language', { language })
      .leftJoinAndSelect('products.images', 'productImages')
      .where('content.alias = :alias', { alias })
      .getOne();

    if (!category) return null;

    const newCategory = this.parseSubcategory(category);

    newCategory.products = category.products.map((product) => {
      return this.productService.parseProducts(product);
    });

    return newCategory;
  }

  // CREATE
  async createSubcategory(subcategoryDto: CreateSubcategoryDto) {
    return this.subcategoryRepository.save({ ...subcategoryDto, category: { id: subcategoryDto.categoryId } });
  }

  async createContent(subcategoryId: number, contentDto: CreateSubcategoryContentDto) {
    return this.subcategoryContentRepository.save({
      ...contentDto,
      alias: aliasConvertor(contentDto.title, subcategoryId),
      subcategory: { id: subcategoryId },
    });
  }

  // UPDATE
  async updateCategory(subcategoryId: number, subcategoryDto: UpdateSubcategoryDto) {
    return this.subcategoryRepository.save({
      ...subcategoryDto,
      id: subcategoryId,
    });
  }

  async updateContent(contentId: number, contentDto: UpdateSubcategoryContentDto, subcategoryId: number) {
    return this.subcategoryContentRepository.save({
      ...contentDto,
      id: contentId,
      alias: aliasConvertor(contentDto.title, subcategoryId),
    });
  }

  // CHECK
  async checkSubcategoryById(subcategoryId: number) {
    return this.subcategoryRepository.findOne({ where: { id: subcategoryId } });
  }

  async checkSubcategoryByAlias(alias: string) {
    return this.subcategoryRepository.findOne({ where: { contents: { alias } } });
  }

  async checkContentById(contentId: number) {
    return this.subcategoryContentRepository.findOne({ where: { id: contentId }, relations: { subcategory: true } });
  }

  async checkContentForExist(subcategoryId: number, language: LanguageEnum) {
    return this.subcategoryContentRepository.findOne({ where: { subcategory: { id: subcategoryId }, language } });
  }

  // PARSERS
  parseSubcategory(subcategory: SubcategoryEntity) {
    const newSubcategory: SubcategoryDto = plainToClass(SubcategoryDto, subcategory, { excludeExtraneousValues: true });

    if (subcategory.contents && subcategory.contents.length) {
      newSubcategory.title = subcategory.contents[0].title;
      newSubcategory.alias = subcategory.contents[0].alias;
    }

    newSubcategory.productsTotal = subcategory.products.length;

    return newSubcategory;
  }

  async updateAliases() {
    const contents = await this.subcategoryContentRepository.find({ relations: { subcategory: true } });

    const newContents = [];

    for (const content of contents) {
      const newContent = await this.subcategoryContentRepository.save({
        id: content.id,
        alias: aliasConvertor(content.title, content.subcategory.id),
      });
      newContent.title = content.title;

      newContents.push(newContent);
    }

    return newContents;
  }
}
