# Medusa Plugin Ultimate

The Medusa Plugin Ultimate is a powerful tool that allows developers to easily add a user interface to entities marked with a decorator. With this plugin, you can seamlessly create, edit, view, and delete documents associated with these entities, and expose them through a specific route for your store.

## Features

- **Entity UI Integration:** The Medusa Plugin Ultimate seamlessly integrates with your entities. By simply marking an entity with a decorator, you can enable a user interface for it in the Medusa dashboard.

- **Create, Edit, View, Delete:** Once your entity has a UI, you can easily perform essential CRUD operations. Create new documents, edit existing ones, view their details, and delete them with ease.

- **Customizable UI:** The UI generated by this plugin is customizable, allowing you to tailor it to your specific requirements. You can control the appearance and behavior of the UI elements.

- **Route Exposition:** In addition to the dashboard integration, this plugin exposes your entity documents via a specific route. This makes it easy for your store to interact with these documents programmatically.

## Installation

1. **Install the Plugin:**

   ```shell
   npm i medusa-plugin-ultimate
   ```

   ```shell
   yarn add medusa-plugin-ultimate
   ```

   ```shell
   pnpm i medusa-plugin-ultimate
   ```

2. **Configure the Plugin:**
   Edit the configuration files to specify the entities you want to add the UI for and configure other settings as needed.
   ```ts
   ///...other plugins
   {
      resolve: 'medusa-plugin-ultimate',
      options: {
         enableUI: true,
         storeEndpoint: MEDUSA_PLUGIN_ULTIMATE_STORE_ENDPOINT,
         adminEndpoint: MEDUSA_PLUGIN_ULTIMATE_ADMIN_ENDPOINT,
      },
   },
   ```
   - `enableUI`: enable the plugin changes to the UI, if set to false marked entities will not have ui.
   - `adminEndpoint`: admin endpoint where you can access the marked entities, set to `/admin/ultimate-entities` by default.
   - `storeEndpoint`: store endpoint where you can access the marked entities, set to `/store/ultimate-entities` by default.

## Usage

- **Mark your entity with our custom decorators:**

  Use our custom decorators:

  - `@UltimateEntity()` on your class to create a ui for it.
  - `@UltimateEntityField` on your class fields.

  ```ts
  // src/models/person.ts

  import { BeforeInsert, Column, Entity, PrimaryColumn } from "typeorm";

  import { BaseEntity } from "@medusajs/medusa";
  import { generateEntityId } from "@medusajs/utils";

  import {
    UltimateEntity,
    UltimateEntityField,
    UltimateEntityFieldTypes,
  } from "medusa-plugin-ultimate/dist/index";

  export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    UNKNOWN = "UNKNOWN",
  }

  @Entity()
  @UltimateEntity()
  export class Person extends BaseEntity {
    @Column({ type: "varchar", nullable: false })
    @UltimateEntityField({
      type: UltimateEntityFieldTypes.STRING,
    })
    name: string;

    @Column({ type: "varchar", nullable: true })
    @UltimateEntityField({
      type: UltimateEntityFieldTypes.IMAGE,
    })
    image: string;

    @Column({ type: "enum", default: Gender.UNKNOWN, enum: Gender })
    @UltimateEntityField({
      name: "Gender",
      type: UltimateEntityFieldTypes.SELECT,
      options: [
        {
          value: Gender.MALE,
          label: "Male",
          description: "Male gender.",
        },
        {
          value: Gender.FEMALE,
          label: "Female",
          description: "Female gender.",
        },
        {
          value: Gender.UNKNOWN,
          label: "Unknown",
          description: "Don't specify / unknown.",
        },
      ],
      description: "The person gender",
    })
    gender: Gender;

    @UltimateEntityField({
      type: UltimateEntityFieldTypes.BOOLEAN,
    })
    @Column({ type: "bool", default: false })
    isPublic: boolean;

    @BeforeInsert()
    private beforeInsert(): void {
      this.id = generateEntityId(this.id, "person");
    }
  }
  ```

- **`UltimateEntity()`:**

  ```ts
  UltimateEntityField({
      name: "Name displayed on the entity page.";
      description: "Description displayed on the entity page";
  })
  ```

  accepted params

  - list params
  -
  -

- **`UltimateEntityField()`:**
  ```ts
  UltimateEntityField({
      type: UltimateEntityFieldTypes.STRING;
      defaultValue?: "default-name";
      variant?: UltimateEntityFieldTypeMap[T];
      note?: "will appear when hover on infos icon of the field.";
      name?: "field name.";
      description?: "field description";
      // only for fields with type set to UltimateEntityFieldTypes.SELECT
      options?: [
         {
            value: "first-value",
            label: "first-label",
            description: "optional-description"
         },
         // other options here..
      ];
  })
  ```
  accepted params
  - list params
  -
  -

## Endpoints

we gonna take this entity as an example

```ts
@Entity()
@UltimateEntity()
export class BlogPost extends BaseEntity {
  // code...
}
```

the entity id will be <u>**blog_post**</u>

- GET: `<ADMIN_BACKEND_URL>/store/ultimate-entities/:ultimate-entity-id/documents`

  will return all the documents of that entity, filtering is also possible

  - entity column: `<ADMIN_BACKEND_URL>/store/ultimate-entities/:ultimate-entity-id/documents?name=example-name-1,example-name-1`
    => will return all the documents with a name of example-name-1 or example-name-2
  - limit: number
  - offset: number
  - order: string | string[]
  - q: string

- GET: `<ADMIN_BACKEND_URL>/store/ultimate-entities/:ultimate-entity-id/documents/:documentId`

  will return the coresponding document
