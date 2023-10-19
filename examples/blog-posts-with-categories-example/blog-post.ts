// src/models/blog-post.ts

import { ManyToOne, Column, Entity, BeforeInsert } from "typeorm";

import { BaseEntity, generateEntityId } from "@medusajs/medusa";

import {
  UltimateEntity,
  UltimateEntityField,
  UltimateEntityFieldTypes,
  UltimateEntityRelation,
  UltimateEntityRelationTypes,
} from "medusa-plugin-ultimate/dist/index";

import BlogPostCategory from "./blog-post-category";

@Entity()
@UltimateEntity({
  group: "Blog",
})
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

  @UltimateEntityRelation({
    type: UltimateEntityRelationTypes.MANY_TO_ONE_RELATION_SELECT,
    relationEntityId: "blog_post_category",
  })
  @ManyToOne(
    () => BlogPostCategory,
    (blogPostCategory) => blogPostCategory.blogPosts,
    { nullable: true }
  )
  category: BlogPostCategory;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "blog-post");
  }
}
