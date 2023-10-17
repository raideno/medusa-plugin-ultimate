/**
 * /ultimate-entities get ultimate entities, return entities with schema
 * /ultimate-entities/:ultimate-entitiy-id get ultimate entity schema, return entitiy with schema
 * /ultimate-entities/:ultimate-entitiy-id/documents get ultimate entity schema documents
 */

import { Router } from "express";

import { wrapHandler } from "@medusajs/utils";

import getUltimateEntityDocuments from "./get-ultimate-entity-documents";
import getUltimateEntityDocument from "./get-ultimate-entity-document";

const router = Router();

export default (adminRouter: Router) => {
  adminRouter.use("/ultimate-entities", router);

  router.get(
    "/:ultimateEntityId/documents",
    wrapHandler(getUltimateEntityDocuments)
  );

  router.get(
    "/:ultimateEntityId/documents/:documentId",
    wrapHandler(getUltimateEntityDocument)
  );
};
