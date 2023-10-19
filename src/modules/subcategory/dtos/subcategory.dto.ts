import { Exclude, Expose } from 'class-transformer';

import { ProductDto } from '@modules/product/dtos/product.dto';

export class SubcategoryDto {
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
  products: ProductDto[];

  @Expose()
  createAt: Date;

  @Expose()
  updateAt: Date;
}
