// src/models/product.ts

import { Column, Entity } from "typeorm";

import { Product as MedusaProduct } from "@medusajs/medusa";

import {
  UltimateEntity,
  UltimateEntityField,
  UltimateEntityFieldTypes,
} from "medusa-plugin-ultimate/dist/index";

@Entity()
@UltimateEntity({
  hidden: true,
})
export class Product extends MedusaProduct {
  @UltimateEntityField({
    type: UltimateEntityFieldTypes.MARKDOWN,
  })
  @Column({ type: "varchar", nullable: true })
  rich_description?: string | null;
}

import { IsString, IsOptional } from "class-validator";
import { registerOverriddenValidators } from "@medusajs/medusa";
import { AdminPostProductsReq as MedusaAdminPostProductsReq } from "@medusajs/medusa/dist/api/routes/admin/products/create-product";
import { AdminPostProductsProductReq as MedusaAdminPostProductsProductReq } from "@medusajs/medusa/dist/api/routes/admin/products/update-product";

class AdminPostProductsReq extends MedusaAdminPostProductsReq {
  @IsOptional()
  @IsString()
  rich_description?: string | null;
}

class AdminPostProductsProductReq extends MedusaAdminPostProductsProductReq {
  @IsOptional()
  @IsString()
  rich_description?: string | null;
}

registerOverriddenValidators(AdminPostProductsReq);
registerOverriddenValidators(AdminPostProductsProductReq);
