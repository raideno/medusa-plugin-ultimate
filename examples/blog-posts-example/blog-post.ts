// src/models/blog-post.ts

import { Column, Entity, BeforeInsert } from "typeorm";

import { BaseEntity, generateEntityId } from "@medusajs/medusa";

import {
  UltimateEntity,
  UltimateEntityField,
  UltimateEntityFieldTypes,
} from "medusa-plugin-ultimate/dist/index";

@Entity()
@UltimateEntity({})
export default class BlogPost extends BaseEntity {
  @UltimateEntityField({
    type: UltimateEntityFieldTypes.STRING,
  })
  @Column({ type: "string" })
  title: string;

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

  @UltimateEntityField({
    type: UltimateEntityFieldTypes.MARKDOWN,
  })
  @Column({ type: "string" })
  content: string;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "blog-post");
  }
}
