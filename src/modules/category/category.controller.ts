import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Query,
  Body,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  ParseIntPipe,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';

import { EnumValidationPipe } from '@pipes/EnumValidation.pipe';

import { ResponseInterceptor } from '@interceptors/response.interceptor';

import { IPagination } from '@interfaces/pagination.interface';
import { LanguageEnum } from '@enums/language.enum';

import { CategoryService } from './category.service';

import { CreateCategoryDto, CreateCategoryContentDto } from './dtos/create-category.dto';
import { UpdateCategoryDto, UpdateCategoryContentDto } from './dtos/update-category.dto';

@Controller('category')
@UseInterceptors(ResponseInterceptor)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // GET
  @Get('get-all')
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Query('language', new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
    @Query() { page, limit }: IPagination,
  ) {
    return await this.categoryService.findAll(language, page, limit);
  }

  @Get('with-subcategories')
  @HttpCode(HttpStatus.OK)
  async getWithSubcategories(
    @Query('language', new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
    @Query() { page, limit }: IPagination,
  ) {
    return await this.categoryService.findAllWithSubCategories(language, page, limit);
  }

  @Get('by-id/:categoryId')
  @HttpCode(HttpStatus.OK)
  async getById(
    @Param('categoryId', new ParseIntPipe()) categoryId: number,
    @Query('language', new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
  ) {
    return this.categoryService.findById(categoryId, language);
  }

  @Get('by-uuid/:categoryUUID')
  @HttpCode(HttpStatus.OK)
  async getByUUID(
    @Param('categoryUUID', new ParseUUIDPipe()) categoryUUID: string,
    @Query('language', new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
  ) {
    return this.categoryService.findByUUID(categoryUUID, language);
  }

  // POST
  @Post('get-alias/:language')
  @HttpCode(HttpStatus.OK)
  async getAliasByLanguage(
    @Param('language', new EnumValidationPipe(LanguageEnum, { required: true })) language: LanguageEnum,
    @Body('alias') alias: string,
  ) {
    const category = await this.categoryService.checkCategoryByAlias(alias);
    if (!category) throw new BadRequestException();

    return this.categoryService.findAlias(category.id, language);
  }

  @Post('get-by-alias/:language')
  @HttpCode(HttpStatus.OK)
  async getByAlias(
    @Param('language', new EnumValidationPipe(LanguageEnum, { required: true })) language: LanguageEnum,
    @Body('alias') alias: string,
  ) {
    return this.categoryService.findByAlias(alias, language);
  }

  @Post('create-category')
  @HttpCode(HttpStatus.CREATED)
  async createCategory(@Body(new ValidationPipe()) categoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(categoryDto);
  }

  @Post('create-content/:categoryId')
  @HttpCode(HttpStatus.CREATED)
  async createContent(
    @Param('categoryId', new ParseIntPipe()) categoryId: number,
    @Body(new ValidationPipe()) contentDto: CreateCategoryContentDto,
  ) {
    const category = await this.categoryService.checkCategoryById(categoryId);
    if (!category) throw new BadRequestException();

    const oldContent = await this.categoryService.checkContentForExist(categoryId, contentDto.language);
    if (oldContent) throw new BadRequestException();

    return this.categoryService.createContent(categoryId, contentDto);
  }

  // PUT
  @Put('update-category/:categoryId')
  @HttpCode(HttpStatus.ACCEPTED)
  async updateCategory(
    @Param('categoryId', new ParseIntPipe()) categoryId: number,
    @Body(new ValidationPipe()) categoryDto: UpdateCategoryDto,
  ) {
    const category = await this.categoryService.checkCategoryById(categoryId);
    if (!category) throw new BadRequestException();

    return this.categoryService.updateCategory(categoryId, categoryDto);
  }

  @Put('update-content/:contentId')
  @HttpCode(HttpStatus.ACCEPTED)
  async updateContent(
    @Param('contentId', new ParseIntPipe()) contentId: number,
    @Body(new ValidationPipe()) contentDto: UpdateCategoryContentDto,
  ) {
    const content = await this.categoryService.checkContentById(contentId);
    if (!content) throw new BadRequestException();

    return this.categoryService.updateContent(contentId, contentDto, content.category.id);
  }

  @Get('update-aliases')
  @HttpCode(HttpStatus.ACCEPTED)
  async updateAliases() {
    return this.categoryService.updateAliases();
  }
}
