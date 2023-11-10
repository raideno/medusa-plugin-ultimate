/**
 * create:
 *          - exclude unmutable fields (id, created_at, deleted_at, updated_at) + defined / custm ones
 *          - get the ultimateEntity
 *          - get the ultimateEntityFields
 *          - merge fields with default values to complete empty ones
 *          -
 *          - validate the data with valdiators if enabled
 *          - check that the given fields match with the available fields
 * update:
 *          - same process as the first one + exclude unmutable fields (id, created_at, deleted_at, updated_at) + defined / custm ones
 * delete: simply give the id of the document to delete
 */
/**
 * /ultimate-entities get ultimate entities, return entities with schema
 * /ultimate-entities/:ultimate-entitiy-id get ultimate entity schema, return entitiy with schema
 * /ultimate-entities/:ultimate-entitiy-id/documents get ultimate entity schema documents
 */

import { Router } from "express";

import { wrapHandler } from "@medusajs/medusa";

import createUltimateEntityDocument from "./create-ultimate-entity-document";
import updateUltimateEntityDocument from "./update-ultimate-entity-document";
import deleteUltimateEntityDocument from "./delete-ultimate-entity-document";

const router = Router();

export default (adminRouter: Router) => {
  adminRouter.use("/ultimate-entities", router);

  router.post(
    "/:ultimateEntityId/documents",
    wrapHandler(createUltimateEntityDocument)
  );

  router.put(
    "/:ultimateEntityId/documents/:documentId",
    wrapHandler(updateUltimateEntityDocument)
  );

  router.delete(
    "/:ultimateEntityId/documents/:documentId",
    wrapHandler(deleteUltimateEntityDocument)
  );
};
