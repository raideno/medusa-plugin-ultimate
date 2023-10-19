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
