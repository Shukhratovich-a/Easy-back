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

import { LanguageEnum } from '@enums/language.enum';

import { CategoryService } from '@modules/category/category.service';
import { SubcategoryService } from './subcategory.service';

import { CreateSubcategoryDto, CreateSubcategoryContentDto } from './dtos/create-subcategory.dto';
import { UpdateSubcategoryDto, UpdateSubcategoryContentDto } from './dtos/update-subcategory.dto';

@Controller('subcategory')
@UseInterceptors(ResponseInterceptor)
export class SubcategoryController {
  constructor(
    private readonly subcategoryService: SubcategoryService,
    private readonly categoryService: CategoryService,
  ) {}

  // GET
  @Get('get-all')
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Query('language', new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
  ) {
    return await this.subcategoryService.findAll(language);
  }

  @Get('with-products')
  @HttpCode(HttpStatus.OK)
  async getWithProducts(
    @Query('language', new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
  ) {
    return await this.subcategoryService.findAllWithProducts(language);
  }

  @Get('by-id/:subcategoryId')
  @HttpCode(HttpStatus.OK)
  async getById(
    @Param('subcategoryId', new ParseIntPipe()) subcategoryId: number,
    @Query('language', new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
  ) {
    return this.subcategoryService.findById(subcategoryId, language);
  }

  @Get('by-uuid/:subcategoryUUID')
  @HttpCode(HttpStatus.OK)
  async getByUUID(
    @Param('subcategoryUUID', new ParseUUIDPipe()) subcategoryUUID: number,
    @Query('language', new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
  ) {
    return this.subcategoryService.findByUUID(subcategoryUUID, language);
  }

  // POST
  @Post('get-alias/:language')
  @HttpCode(HttpStatus.OK)
  async getAliasByLanguage(
    @Param('language', new EnumValidationPipe(LanguageEnum, { required: true })) language: LanguageEnum,
    @Body('alias') alias: string,
  ) {
    const subcategory = await this.subcategoryService.checkSubcategoryByAlias(alias);
    if (!subcategory) throw new BadRequestException();

    return this.subcategoryService.findAlias(subcategory.id, language);
  }

  @Post('get-by-alias/:language')
  @HttpCode(HttpStatus.OK)
  async getByAlias(
    @Param('language', new EnumValidationPipe(LanguageEnum, { required: true })) language: LanguageEnum,
    @Body('alias') alias: string,
  ) {
    return this.subcategoryService.findByAlias(alias, language);
  }

  @Post('create-subcategory')
  @HttpCode(HttpStatus.CREATED)
  async createSubcategory(@Body(new ValidationPipe()) categoryDto: CreateSubcategoryDto) {
    const category = this.categoryService.checkCategoryById(categoryDto.categoryId);
    if (!category) throw new BadRequestException();

    return this.subcategoryService.createSubcategory(categoryDto);
  }

  @Post('create-content/:subcategoryId')
  @HttpCode(HttpStatus.CREATED)
  async createContent(
    @Param('subcategoryId', new ParseIntPipe()) subcategoryId: number,
    @Body(new ValidationPipe()) contentDto: CreateSubcategoryContentDto,
  ) {
    const subcategory = await this.subcategoryService.checkSubcategoryById(subcategoryId);
    if (!subcategory) throw new BadRequestException();

    const oldContent = await this.subcategoryService.checkContentForExist(subcategoryId, contentDto.language);
    if (oldContent) throw new BadRequestException();

    return this.subcategoryService.createContent(subcategoryId, contentDto);
  }

  // PUT
  @Put('update-subcategory/:subcategoryId')
  @HttpCode(HttpStatus.ACCEPTED)
  async updateSubcategory(
    @Param('subcategoryId', new ParseIntPipe()) subcategoryId: number,
    @Body(new ValidationPipe()) categoryDto: UpdateSubcategoryDto,
  ) {
    const subcategory = await this.subcategoryService.checkSubcategoryById(subcategoryId);
    if (!subcategory) throw new BadRequestException();

    return this.subcategoryService.updateCategory(subcategoryId, categoryDto);
  }

  @Put('update-content/:contentId')
  @HttpCode(HttpStatus.ACCEPTED)
  async updateContent(
    @Param('contentId', new ParseIntPipe()) contentId: number,
    @Body(new ValidationPipe()) contentDto: UpdateSubcategoryContentDto,
  ) {
    const content = await this.subcategoryService.checkContentById(contentId);
    if (!content) throw new BadRequestException();

    return this.subcategoryService.updateContent(contentId, contentDto, content.subcategory.id);
  }

  @Get('update-aliases')
  @HttpCode(HttpStatus.ACCEPTED)
  async updateAliases() {
    return this.subcategoryService.updateAliases();
  }
}
