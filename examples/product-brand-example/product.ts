// src/models/product.ts

import { ManyToOne, Entity } from "typeorm";

import { Product as MedusaProduct } from "@medusajs/medusa";

import {
  UltimateEntity,
  UltimateEntityRelation,
  UltimateEntityRelationTypes,
} from "medusa-plugin-ultimate/dist/index";
import ProductBrand from "./product-brand";

@Entity()
@UltimateEntity({
  hidden: true,
})
export class Product extends MedusaProduct {
  @UltimateEntityRelation({
    relationEntityId: "brand",
    type: UltimateEntityRelationTypes.MANY_TO_ONE_RELATION_SELECT,
  })
  @ManyToOne(() => ProductBrand, (productBrand) => productBrand.products, {
    nullable: true,
  })
  @JoinColumn({
    name: "brand_id",
    referencedColumnName: "id",
  })
  brand?: ProductBrand | null;
}
