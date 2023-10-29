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

  const adminProductCategoryImports = (await import(
    "@medusajs/medusa/dist/api/routes/admin/product-categories/index"
  )) as any;

  const relations = utlimateEntity.relations.map(
    (ultimateEntityRelation) => ultimateEntityRelation.id
  );

  console.log(
    "[medusa-plugin-ultimate](admin-product-category-relations):",
    relations.join(", ")
  );

  adminProductCategoryImports.defaultAdminProductCategoryRelations = [
    ...adminProductCategoryImports.defaultAdminProductCategoryRelations,
    ...relations,
  ];

  adminProductCategoryImports.allowedAdminProductCategoryRelations = [
    ...adminProductCategoryImports.allowedAdminProductCategoryRelations,
    ...relations,
  ];

  console.log(
    "[medusa-plugin-ultimate](admin-product-category-relations):",
    "completed"
  );
}
