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
    ultimateEntityService.retrieveUltimateEntity("product_collection");

  if (
    !utlimateEntity ||
    utlimateEntity === undefined ||
    utlimateEntity === null
  )
    return;

  const storeProductCollectionImports = (await import(
    "@medusajs/medusa/dist/api/routes/store/collections"
  )) as any;

  const relations = utlimateEntity.relations.map(
    (ultimateEntityRelation) => ultimateEntityRelation.id
  );

  console.log(
    "[medusa-plugin-ultimate](store-product-collection-relations):",
    relations.join(", ")
  );

  storeProductCollectionImports.defaultStoreCollectionRelations = [
    ...storeProductCollectionImports.defaultStoreCollectionRelations,
    ...relations,
  ];

  console.log(
    "[medusa-plugin-ultimate](store-product-collection-relations):",
    "completed"
  );
}
