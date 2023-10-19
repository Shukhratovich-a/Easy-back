import { Exclude, Expose } from 'class-transformer';

import { SubcategoryDto } from '@modules/subcategory/dtos/subcategory.dto';

export class CategoryDto {
  @Expose()
  id: number;

  @Expose()
  uuid: string;

  @Expose()
  icon: string;

  @Expose()
  poster: string;

  @Exclude()
  title: string;

  @Exclude()
  alias: string;

  @Exclude()
  productsTotal: number;

  @Exclude()
  subcategories: SubcategoryDto[];

  @Expose()
  createAt: Date;

  @Expose()
  updateAt: Date;
}
