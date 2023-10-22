## Example Use Case: Blog Posts

By doing this you'll automatically have a markdown editor added to your product page in the admin dashboard through which you can update the field you added.

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

For the backend we will need to accomplish 2 steps:

- Extend the product entity and mark it with the `@UltimateEntity({})` decorator and add the `rich_description` field / column to it and mark it with the `@UltimateEntityField({})` decorator.
- Extend the product validators.

```ts
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
  isBuiltInEntity: true,
  hidden: true,
})
export class Product extends MedusaProduct {
  @UltimateEntityField({
    type: UltimateEntityFieldTypes.MARKDOWN,
  })
  @Column({ type: "varchar", nullable: true })
  rich_description?: string | null;
}

// extending the validators

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
```

### Frontend Integration

When retreiving a product you'll automatically receive the rich_description field with it.

#### Preview

Finally after configuring everything you'll have a similar ui in your medusa admin dashboard trough which you can write new blog posts, view old ones and edit or delete them.

![Screenshot or Visual](./assets/blog-post-example-image-1.png)
![Screenshot or Visual](./assets/blog-post-example-image-2.png)
![Screenshot or Visual](./assets/blog-post-example-image-3.png)
![Screenshot or Visual](./assets/blog-post-example-image-4.png)

[Link to Full Documentation](../../README.md)
