import { Controller, Get, Post, Put, Query, Param, Body, ParseIntPipe, BadRequestException } from '@nestjs/common';

import { EnumValidationPipe } from '@pipes/EnumValidation.pipe';

import { LanguageEnum } from '@enums/language.enum';

import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // GET
  @Get('get-all')
  async getAll(
    @Query('language', new EnumValidationPipe(LanguageEnum, { defaultValue: LanguageEnum.RU })) language: LanguageEnum,
  ) {
    return await this.productService.findAll(language);
  }

  // POST
  @Post('get-alias/:language')
  async getAliasByLang(
    @Param('language', new EnumValidationPipe(LanguageEnum, { required: true })) language: LanguageEnum,
    @Body('alias') alias: string,
  ) {
    return this.productService.findAlias(alias, language);
  }

  @Post('get-by-alias/:language')
  async getByAlias(
    @Param('language', new EnumValidationPipe(LanguageEnum, { required: true })) language: LanguageEnum,
    @Body('alias') alias: string,
  ) {
    return this.productService.findByAlias(alias, language);
  }

  // PUT
  @Put('update-content/:contentId')
  async updateContent(@Param('contentId', new ParseIntPipe()) contentId: number, @Body() contentDto) {
    const content = await this.productService.checkContentById(contentId);
    if (!content) throw new BadRequestException();

    return this.productService.updateContent(contentId, contentDto, content.product.id);
  }

  @Get('update-aliases')
  async updateAliases() {
    return this.productService.updateAliases();
  }
}
