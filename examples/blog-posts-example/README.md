## Example Use Case: Blog Posts

**Description:** This example will show you how to implement blog post functionality into your medusa backend with medusa-plugin-ultimate.

**Keywords:** medusa-plugin-ultimate, blog-post

### Instalation

_skip this phase of you already have the plugin_

1. instalation First of all you need to install the plugin with one of the commands bellow

- - ```
    npm i medusa-plugin-ultimate
    ```
- - ```
    yarn add medusa-plugin-ultimate
    ```
- - ```
    pnpm i medusa-plugin-ultimate
    ```

2. configuration then you need to register the plugin into your medusa-config file

   ```ts
   // medusa-config.js

   const plugins = [
     ///...other plugins
     {
       resolve: "medusa-plugin-ultimate",
       options: {
         enableUI: true,
         backendUrl: undefined,
         ultimateEntitiesAdminEndpointPath: undefined,
         ultimateEntitiesStoreEndpointPath: undefined,
       },
     },
   ];

   // ...
   ```

### Backend Integration

For the backend you'll need to create a model in the src/models directory just like this:

```ts
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
  slug: string;

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
```

### Frontend Integration

In order to access to your blog post on your frontend you have access to this two api endpoints that the plugin automatically creates for you:

- Get all of your blog posts

  ```ts
  GET: `<BACKEND_URL>/store/ultimate-entities/blog_post/documents`;
  ```

- Get a blog post with slug

  ```ts
  GET: `<BACKEND_URL>/store/ultimate-entities/blog_post/documents?slug=<YOUR_BLOG_POST_SLUG>`;
  ```

- Get a blog post with id

  ```ts
  GET: `<BACKEND_URL>/store/ultimate-entities/blog_post/documents/<YOUR_BLOG_POST_ID>`;
  ```

To know more about endpoints check the full [Documentation](../../README.md).

#### Preview

Finally after configuring everything you'll have a similar ui in your medusa admin dashboard trough which you can write new blog posts, view old ones and edit or delete them.

![Screenshot or Visual](./assets/blog-post-example-image-1.png)
![Screenshot or Visual](./assets/blog-post-example-image-2.png)
![Screenshot or Visual](./assets/blog-post-example-image-3.png)
![Screenshot or Visual](./assets/blog-post-example-image-4.png)

[Link to Full Documentation](../../README.md)
