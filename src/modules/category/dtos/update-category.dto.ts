import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({
    name: 'icon',
    required: false,
    type: 'string',
    example: 'https://host.com/icon.webp',
  })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({
    name: 'poster',
    required: false,
    type: 'string',
    example: 'https://host.com/poster.webp',
  })
  @IsString()
  @IsOptional()
  poster?: string;
}

export class UpdateCategoryContentDto {
  @ApiProperty({
    name: 'title',
    required: true,
    type: 'string',
    example: 'Электроника',
  })
  @IsString()
  title: string;
}
