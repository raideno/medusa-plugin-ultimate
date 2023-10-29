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
    "@medusajs/medusa/dist/api/routes/admin/product-categories"
  )) as any;

  const fields = utlimateEntity.fields.map(
    (ultimateEntityField) => ultimateEntityField.id
  );

  console.log(
    "[medusa-plugin-ultimate](admin-product-category-fields):",
    fields.join(", ")
  );

  adminProductCategoryImports.defaultProductCategoryFields = [
    ...adminProductCategoryImports.defaultProductCategoryFields,
    ...fields,
  ];

  console.log(
    "[medusa-plugin-ultimate](admin-product-category-fields):",
    "completed"
  );
}
