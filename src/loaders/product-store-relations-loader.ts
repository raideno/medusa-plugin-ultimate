import { AwilixContainer } from "awilix";

import { ConfigModule, Logger } from "@medusajs/medusa";

import UltimateEntityService from "../services/ultimate-entity";

export default async function (
  container: AwilixContainer,
  logger: Logger,
  config: ConfigModule
) {
  const ultimateEntityService = container.resolve<UltimateEntityService>(
    "ultimateEntityService"
  );

  const utlimateEntity =
    ultimateEntityService.retrieveUltimateEntity("product");

  if (
    !utlimateEntity ||
    utlimateEntity === undefined ||
    utlimateEntity === null
  )
    return;

  const storeProductImports = (await import(
    "@medusajs/medusa/dist/api/routes/store/products/index"
  )) as any;

  const relations = utlimateEntity.relations.map(
    (ultimateEntityRelation) => ultimateEntityRelation.id
  );

  logger.log(
    "[medusa-plugin-ultimate](store-product-relations):",
    relations.join(", ")
  );

  storeProductImports.allowedStoreProductsRelations = [
    ...storeProductImports.allowedStoreProductsRelations,
    ...relations,
  ];
  storeProductImports.defaultStoreProductsRelations = [
    ...storeProductImports.defaultStoreProductsRelations,
    ...relations,
  ];

  logger.log("[medusa-plugin-ultimate](store-product-relations):", "completed");
}
