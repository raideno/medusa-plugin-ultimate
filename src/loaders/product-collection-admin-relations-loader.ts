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
    ultimateEntityService.retrieveUltimateEntity("product_collection");

  if (
    !utlimateEntity ||
    utlimateEntity === undefined ||
    utlimateEntity === null
  )
    return;

  const adminProductCollectionImports = (await import(
    "@medusajs/medusa/dist/api/routes/admin/collections"
  )) as any;

  const relations = utlimateEntity.relations.map(
    (ultimateEntityRelation) => ultimateEntityRelation.id
  );

  logger.log(
    "[medusa-plugin-ultimate](admin-product-collection-relations):",
    relations.join(", ")
  );

  adminProductCollectionImports.defaultAdminCollectionsRelations = [
    ...adminProductCollectionImports.defaultAdminCollectionsRelations,
    ...relations,
  ];

  logger.log(
    "[medusa-plugin-ultimate](admin-product-collection-relations):",
    "completed"
  );
}
