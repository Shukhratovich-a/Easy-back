import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { aliasConvertor } from '@utils/aliasConvertor.util';

import { LanguageEnum } from '@enums/language.enum';

import { SubcategoryService } from '@modules/subcategory/subcategory.service';

import { CategoryEntity, CategoryContentEntity } from './category.entity';

import { CategoryDto } from './dtos/category.dto';
import { CreateCategoryDto, CreateCategoryContentDto } from './dtos/create-category.dto';
import { UpdateCategoryDto, UpdateCategoryContentDto } from './dtos/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(CategoryContentEntity)
    private readonly categoryContentRepository: Repository<CategoryContentEntity>,
    private readonly subcategoryService: SubcategoryService,
  ) {}

  // FIND
  async findAll(language?: LanguageEnum, page?: number, limit?: number) {
    const categories = await this.categoryRepository.find({
      relations: { contents: true, subcategories: { products: true } },
      where: { contents: { language } },
      take: limit,
      skip: (page - 1) * limit || 0,
    });
    if (!categories) return [];

    const newCategories: CategoryDto[] = categories.map((category) => {
      return this.parseCategory(category);
    });

    return newCategories;
  }

  async findAllWithSubCategories(language?: LanguageEnum, page?: number, limit?: number) {
    const categories = await this.categoryRepository
      .createQueryBuilder('categories')
      .innerJoinAndSelect('categories.contents', 'content', 'content.language = :language', { language })
      .leftJoinAndSelect('categories.subcategories', 'subcategories')
      .leftJoinAndSelect('subcategories.contents', 'subContent', 'subContent.language = :language', { language })
      .leftJoinAndSelect('subcategories.products', 'products')
      .leftJoinAndSelect('products.contents', 'productsContent', 'productsContent.language = :language', { language })
      .take(limit || 10)
      .skip((page - 1) * limit || 0)
      .getMany();
    if (!categories) return [];

    const newCategories: CategoryDto[] = categories.map((category) => {
      const newCategory = this.parseCategory(category);

      if (category.subcategories) {
        newCategory.subcategories = category.subcategories.map((subcategory) => {
          return this.subcategoryService.parseSubcategory(subcategory);
        });
      }

      return newCategory;
    });

    return newCategories;
  }

  async findById(categoryId: number, language?: LanguageEnum) {
    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .innerJoinAndSelect('category.contents', 'content', 'content.language = :language', { language })
      .leftJoinAndSelect('category.subcategories', 'subcategories')
      .leftJoinAndSelect('subcategories.contents', 'subContent', 'subContent.language = :language', { language })
      .leftJoinAndSelect('subcategories.products', 'products')
      .leftJoinAndSelect('products.contents', 'productsContent', 'productsContent.language = :language', { language })
      .where('category.id = :categoryId', { categoryId })
      .getOne();

    if (!category) return null;

    const newCategory = this.parseCategory(category);

    newCategory.subcategories = category.subcategories.map((subcategory) => {
      return this.subcategoryService.parseSubcategory(subcategory);
    });

    return newCategory;
  }

  async findByUUID(categoryUUID: string, language?: LanguageEnum) {
    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .innerJoinAndSelect('category.contents', 'content', 'content.language = :language', { language })
      .leftJoinAndSelect('category.subcategories', 'subcategories')
      .leftJoinAndSelect('subcategories.contents', 'subContent', 'subContent.language = :language', { language })
      .leftJoinAndSelect('subcategories.products', 'products')
      .leftJoinAndSelect('products.contents', 'productsContent', 'productsContent.language = :language', { language })
      .where('category.uuid = :categoryUUID', { categoryUUID })
      .getOne();

    if (!category) return null;

    const newCategory = this.parseCategory(category);

    newCategory.subcategories = category.subcategories.map((subcategory) => {
      return this.subcategoryService.parseSubcategory(subcategory);
    });

    return newCategory;
  }

  async findAlias(id: number, language: LanguageEnum) {
    const content = await this.categoryContentRepository.findOne({
      where: { category: { id }, language },
    });

    return { alias: content.alias };
  }

  async findByAlias(alias: string, language: LanguageEnum) {
    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .innerJoinAndSelect('category.contents', 'content', 'content.language = :language and content.alias = :alias', {
        language,
        alias,
      })
      .leftJoinAndSelect('category.subcategories', 'subcategories')
      .leftJoinAndSelect('subcategories.contents', 'subContent', 'subContent.language = :language', { language })
      .leftJoinAndSelect('subcategories.products', 'products')
      .leftJoinAndSelect('products.contents', 'productsContent', 'productsContent.language = :language', { language })
      .where('content.alias = :alias', { alias })
      .getOne();

    if (!category) return null;

    const newCategory = this.parseCategory(category);

    newCategory.subcategories = category.subcategories.map((subcategory) => {
      return this.subcategoryService.parseSubcategory(subcategory);
    });

    return newCategory;
  }

  // CREATE
  async createCategory(categoryDto: CreateCategoryDto) {
    return this.categoryRepository.save({ ...categoryDto });
  }

  async createContent(categoryId: number, contentDto: CreateCategoryContentDto) {
    return this.categoryContentRepository.save({
      ...contentDto,
      alias: aliasConvertor(contentDto.title, categoryId),
      category: { id: categoryId },
    });
  }

  // UPDATE
  async updateCategory(categoryId: number, categoryDto: UpdateCategoryDto) {
    return this.categoryRepository.save({
      ...categoryDto,
      id: categoryId,
    });
  }

  async updateContent(contentId: number, contentDto: UpdateCategoryContentDto, categoryId: number) {
    return this.categoryContentRepository.save({
      ...contentDto,
      id: contentId,
      alias: aliasConvertor(contentDto.title, categoryId),
    });
  }

  // CHECK
  async checkCategoryById(categoryId: number) {
    return this.categoryRepository.findOne({ where: { id: categoryId } });
  }

  async checkCategoryByAlias(alias: string) {
    return this.categoryRepository.findOne({ where: { contents: { alias } } });
  }

  async checkContentById(contentId: number) {
    return this.categoryContentRepository.findOne({ where: { id: contentId }, relations: { category: true } });
  }

  async checkContentForExist(categoryId: number, language: LanguageEnum) {
    return this.categoryContentRepository.findOne({ where: { category: { id: categoryId }, language } });
  }

  // PARSERS
  parseCategory(category: CategoryEntity) {
    const newCategory: CategoryDto = plainToClass(CategoryDto, category, { excludeExtraneousValues: true });

    if (category.contents && category.contents.length) {
      newCategory.title = category.contents[0].title;
      newCategory.alias = category.contents[0].alias;
    }

    let productsCount = 0;
    category.subcategories.forEach((subcategory) => (productsCount = productsCount + subcategory.products.length));
    newCategory.productsTotal = productsCount;

    return newCategory;
  }

  async updateAliases() {
    const contents = await this.categoryContentRepository.find({ relations: { category: true } });

    const newContents = [];

    for (const content of contents) {
      const newContent = await this.categoryContentRepository.save({
        id: content.id,
        alias: aliasConvertor(content.title, content.category.id),
      });
      newContent.title = content.title;

      newContents.push(newContent);
    }

    return newContents;
  }
}
