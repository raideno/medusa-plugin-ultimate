import { AwilixContainer } from "awilix";

import { ConfigModule, Logger } from "@medusajs/medusa";

import UltimateEntityService from "../services/ultimate-entity";

export default async function (
  container: AwilixContainer,

  config: ConfigModule
) {
  const ultimateEntityService = container.resolve<UltimateEntityService>(
    "ultimateEntityService"
  );

  const utlimateEntity =
    ultimateEntityService.retrieveUltimateEntity("product_category");

  if (
    !utlimateEntity ||
    utlimateEntity === undefined ||
    utlimateEntity === null
  )
    return;

  const storeProductCategoryImports = (await import(
    "@medusajs/medusa/dist/api/routes/store/product-categories"
  )) as any;

  const relations = utlimateEntity.relations.map(
    (ultimateEntityRelation) => ultimateEntityRelation.id
  );

  console.log(
    "[medusa-plugin-ultimate](store-product-category-relations):",
    relations.join(", ")
  );

  storeProductCategoryImports.defaultStoreProductCategoryRelations = [
    ...storeProductCategoryImports.defaultStoreProductCategoryRelations,
    ...relations,
  ];

  console.log(
    "[medusa-plugin-ultimate](store-product-category-relations):",
    "completed"
  );
}
