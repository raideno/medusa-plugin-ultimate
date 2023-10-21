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
  isBuiltInEntity: true,
})
export class Product extends MedusaProduct {
  @UltimateEntityRelation({
    relationEntityId: "brand",
    type: UltimateEntityRelationTypes.MANY_TO_ONE_RELATION_SELECT,
  })
  @ManyToOne(() => ProductBrand, (productBrand) => productBrand.products, {
    nullable: true,
    cascade: true,
    eager: true,
  })
  @JoinColumn({
    name: "brand_id",
    referencedColumnName: "id",
  })
  brand?: ProductBrand | null;
}

import { IsOptional, IsObject } from "class-validator";

import { registerOverriddenValidators } from "@medusajs/medusa";
import { AdminPostProductsReq as MedusaAdminPostProductsReq } from "@medusajs/medusa/dist/api/routes/admin/products/create-product";
import { AdminPostProductsProductReq as MedusaAdminPostProductsProductReq } from "@medusajs/medusa/dist/api/routes/admin/products/update-product";

class AdminPostProductsReq extends MedusaAdminPostProductsReq {
  @IsOptional()
  @IsObject()
  brand?: string | null;
}

class AdminPostProductsProductReq extends MedusaAdminPostProductsProductReq {
  @IsOptional()
  @IsObject()
  brand?: string | null;
}

registerOverriddenValidators(AdminPostProductsReq);
registerOverriddenValidators(AdminPostProductsProductReq);
