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

  const adminProductCollectionImports = (await import(
    "@medusajs/medusa/dist/api/routes/admin/collections"
  )) as any;

  const fields = utlimateEntity.fields.map(
    (ultimateEntityField) => ultimateEntityField.id
  );

  console.log(
    "[medusa-plugin-ultimate](admin-product-collection-fields):",
    fields.join(", ")
  );

  adminProductCollectionImports.defaultAdminCollectionsFields = [
    ...adminProductCollectionImports.defaultAdminCollectionsFields,
    ...fields,
  ];

  console.log(
    "[medusa-plugin-ultimate](admin-product-collection-fields):",
    "completed"
  );
}
