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

import { CategoryEntity } from '@modules/category/category.entity';
import { ProductEntity } from '@modules/product/product.entity';

@Entity('subcategories')
export class SubcategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'uuid', type: 'uuid' })
  @Generated('uuid')
  uuid: string;

  @Column({ name: 'icon', type: 'varchar' })
  icon: string;

  @Column({ name: 'poster', type: 'varchar' })
  poster: string;

  @ManyToOne(() => CategoryEntity, (category) => category.subcategories, { nullable: false })
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  @OneToMany(() => SubcategoryContentEntity, (contents) => contents.subcategory, { onDelete: 'CASCADE' })
  contents: Relation<SubcategoryContentEntity[]>;

  @OneToMany(() => ProductEntity, (products) => products.subcategory, { onDelete: 'CASCADE' })
  products: Relation<ProductEntity[]>;

  @CreateDateColumn({ name: 'create_at', type: 'datetime' })
  createAt: Date;

  @UpdateDateColumn({ name: 'update_at', type: 'datetime' })
  updateAt: Date;
}

@Entity('subcategory_contents')
@Index(['language', 'subcategory'], { unique: true })
export class SubcategoryContentEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'title', type: 'varchar' })
  title: string;

  @Column({ name: 'alias', type: 'varchar' })
  alias: string;

  @Column({ name: 'language', type: 'simple-enum', enum: LanguageEnum })
  language: LanguageEnum;

  @ManyToOne(() => SubcategoryEntity, (subcategory) => subcategory.contents, { nullable: false })
  @JoinColumn({ name: 'subcategory_id' })
  subcategory: SubcategoryEntity;
}
