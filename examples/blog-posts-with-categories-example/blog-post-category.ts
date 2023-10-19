// src/models/blog-post.ts

import { Column, Entity, BeforeInsert, OneToMany } from "typeorm";

import { BaseEntity, generateEntityId } from "@medusajs/medusa";

import {
  UltimateEntity,
  UltimateEntityField,
  UltimateEntityFieldTypes,
} from "medusa-plugin-ultimate/dist/index";

import BlogPost from "./blog-post";

@Entity()
@UltimateEntity({})
export default class BlogPostCategory extends BaseEntity {
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

  @OneToMany(() => BlogPost, (blogPost) => blogPost.category, {
    nullable: true,
  })
  blogPosts: BlogPost[];

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "blog-post-category");
  }
}
