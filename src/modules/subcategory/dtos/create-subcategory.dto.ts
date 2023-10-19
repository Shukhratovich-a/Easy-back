import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { LanguageEnum } from '@enums/language.enum';

export class CreateSubcategoryDto {
  @ApiProperty({
    name: 'icon',
    required: true,
    type: 'string',
    example: 'https://host.com/icon.webp',
  })
  @IsString()
  @IsNotEmpty()
  icon: string;

  @ApiProperty({
    name: 'poster',
    required: true,
    type: 'string',
    example: 'https://host.com/poster.webp',
  })
  @IsString()
  @IsNotEmpty()
  poster: string;

  @ApiProperty({
    name: 'categoryId',
    required: true,
    type: 'number',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;
}

export class CreateSubcategoryContentDto {
  @ApiProperty({
    name: 'title',
    required: true,
    type: 'string',
    example: 'Электроника',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    name: 'language',
    required: true,
    enum: LanguageEnum,
    example: 'ru',
  })
  @IsEnum(LanguageEnum)
  @IsNotEmpty()
  language: LanguageEnum;
}
