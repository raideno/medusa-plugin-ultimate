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

  const storeProductImports = (await import(
    "@medusajs/medusa/dist/api/routes/store/products/index"
  )) as any;

  const fields = utlimateEntity.fields.map(
    (ultimateEntityField) => ultimateEntityField.id
  );

  console.log(
    "[medusa-plugin-ultimate](store-product-fields):",
    fields.join(", ")
  );

  storeProductImports.allowedStoreProductsFields = [
    ...storeProductImports.allowedStoreProductsFields,
    ...fields,
  ];
  storeProductImports.defaultStoreProductsFields = [
    ...storeProductImports.defaultStoreProductsFields,
    ...fields,
  ];

  console.log("[medusa-plugin-ultimate](store-product-fields):", "completed");
}
