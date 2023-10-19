import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { LanguageEnum } from '@enums/language.enum';

export class CreateCategoryDto {
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
}

export class CreateCategoryContentDto {
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
