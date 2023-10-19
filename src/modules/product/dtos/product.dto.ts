import { Exclude, Expose } from 'class-transformer';

import { ProductImageEntity } from '../product.entity';

export class ProductDto {
  @Expose()
  id: number;

  @Expose()
  uuid: string;

  @Expose()
  totalAmount: number;

  @Expose()
  availableAmount: number;

  @Expose()
  fullPrice: number;

  @Expose()
  purchasePrice: number;

  @Exclude()
  title: string;

  @Exclude()
  alias: string;

  @Exclude()
  volume: string;

  @Exclude()
  description: string;

  @Exclude()
  images: ProductImageEntity[];

  @Expose()
  createAt: Date;

  @Expose()
  updateAt: Date;
}
