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

import { SubcategoryEntity } from '@modules/subcategory/subcategory.entity';

@Entity('categories')
export class CategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'uuid', type: 'uuid' })
  @Generated('uuid')
  uuid: string;

  @Column({ name: 'icon', type: 'varchar' })
  icon: string;

  @Column({ name: 'poster', type: 'varchar' })
  poster: string;

  @OneToMany(() => CategoryContentEntity, (content) => content.category, { onDelete: 'CASCADE' })
  contents: Relation<CategoryContentEntity[]>;

  @OneToMany(() => SubcategoryEntity, (subcategory) => subcategory.category, { onDelete: 'CASCADE' })
  subcategories: Relation<SubcategoryEntity[]>;

  @CreateDateColumn({ name: 'create_at', type: 'datetime' })
  createAt: Date;

  @UpdateDateColumn({ name: 'update_at', type: 'datetime' })
  updateAt: Date;
}

@Entity('category_contents')
@Index(['language', 'category'], { unique: true })
export class CategoryContentEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'title', type: 'varchar' })
  title: string;

  @Column({ name: 'alias', type: 'varchar' })
  alias: string;

  @Column({ name: 'language', type: 'simple-enum', enum: LanguageEnum })
  language: LanguageEnum;

  @ManyToOne(() => CategoryEntity, (category) => category.contents, { nullable: false })
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;
}
