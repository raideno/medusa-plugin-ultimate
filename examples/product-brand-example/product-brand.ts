// src/models/product-brand.ts

import { OneToMany, Column, Entity, BeforeInsert } from "typeorm";

import { BaseEntity, generateEntityId } from "@medusajs/medusa";

import {
  UltimateEntity,
  UltimateEntityField,
  UltimateEntityFieldTypes,
  UltimateEntityRelation,
  UltimateEntityRelationTypes,
} from "medusa-plugin-ultimate/dist/index";

import { Product } from "./product";

@Entity()
@UltimateEntity({})
export default class ProductBrand extends BaseEntity {
  @UltimateEntityField({
    type: UltimateEntityFieldTypes.STRING,
  })
  @Column({ type: "string" })
  name: string;

  @UltimateEntityField({
    type: UltimateEntityFieldTypes.TEXT,
  })
  @Column({ type: "string" })
  description: string;

  @UltimateEntityField({
    type: UltimateEntityFieldTypes.STRING_ARRAY,
  })
  @Column({ type: "string", array: true, nullable: true })
  keywords: string[] | null;

  @UltimateEntityRelation({
    relationEntityId: "product",
    type: UltimateEntityRelationTypes.ONE_TO_MANY_RELATION_SELECT,
  })
  @OneToMany(() => Product, (product) => product.brand)
  products: Product[];

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "product-brand");
  }
}
