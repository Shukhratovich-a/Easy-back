import {
  Entity,
  BaseEntity,
  Index,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Generated,
  Relation,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { LanguageEnum } from '@enums/language.enum';
import { ImageType } from '@enums/image-type.enum';

import { SubcategoryEntity } from '@modules/subcategory/subcategory.entity';

@Entity('products')
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'uuid', type: 'uuid' })
  @Generated('uuid')
  uuid: string;

  @Column({ name: 'total_amount', type: 'int' })
  totalAmount: number;

  @Column({ name: 'available_amount', type: 'int' })
  availableAmount: number;

  @Column({ name: 'full_price', type: 'int' })
  fullPrice: number;

  @Column({ name: 'purchase_price', type: 'int', nullable: true })
  purchasePrice: number;

  @OneToMany(() => ProductContentEntity, (contents) => contents.product, { onDelete: 'CASCADE' })
  contents: Relation<ProductContentEntity[]>;

  @OneToMany(() => ProductImageEntity, (images) => images.product, { onDelete: 'CASCADE' })
  images: Relation<ProductImageEntity[]>;

  @ManyToOne(() => SubcategoryEntity, (subcategory) => subcategory.products, { nullable: false })
  @JoinColumn({ name: 'subcategory_id' })
  subcategory: SubcategoryEntity;

  @CreateDateColumn({ name: 'create_at', type: 'datetime' })
  createAt: Date;

  @UpdateDateColumn({ name: 'update_at', type: 'datetime' })
  updateAt: Date;
}

@Entity('product_contents')
@Index(['language', 'product'], { unique: true })
export class ProductContentEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'title', type: 'varchar' })
  title: string;

  @Column({ name: 'alias', type: 'varchar' })
  alias: string;

  @Column({ name: 'volume', type: 'varchar' })
  volume: string;

  @Column({ name: 'description', type: 'varchar' })
  description: string;

  @Column({ name: 'language', type: 'simple-enum', enum: LanguageEnum })
  language: LanguageEnum;

  @ManyToOne(() => ProductEntity, (product) => product.contents, { nullable: false })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;
}

@Entity('product_images')
@Index(['type', 'product'], { unique: true })
export class ProductImageEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'jpg_path', type: 'varchar' })
  jpgPath: string;

  @Column({ name: 'webp_path', type: 'varchar' })
  webpPath: string;

  @Column({ name: 'type', type: 'simple-enum', enum: ImageType })
  type: ImageType;

  @ManyToOne(() => ProductEntity, (product) => product.images, { nullable: false })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;
}
