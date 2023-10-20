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
    ultimateEntityService.retrieveUltimateEntity("product");

  if (
    !utlimateEntity ||
    utlimateEntity === undefined ||
    utlimateEntity === null
  )
    return;

  const adminProductImports = (await import(
    "@medusajs/medusa/dist/api/routes/admin/products"
  )) as any;

  const fields = utlimateEntity.fields.map(
    (ultimateEntityField) => ultimateEntityField.id
  );

  console.log(
    "[medusa-plugin-ultimate](admin-product-fields):",
    fields.join(", ")
  );

  adminProductImports.defaultAdminProductFields = [
    ...adminProductImports.defaultAdminProductFields,
    ...fields,
  ];

  console.log("[medusa-plugin-ultimate](admin-product-fields):", "completed");
}
