/**
 * /ultimate-entities get ultimate entities, return entities with schema
 * /ultimate-entities/:ultimate-entitiy-id get ultimate entity schema, return entitiy with schema
 * /ultimate-entities/:ultimate-entitiy-id/documents get ultimate entity schema documents
 */

import { Router } from "express";

import { wrapHandler } from "@medusajs/medusa";

import getUltimateEntities from "./get-ultimate-entities";
import getUltimateEntity from "./get-ultimate-entity";

const router = Router();

export default (adminRouter: Router) => {
  adminRouter.use("/ultimate-entities", router);

  /**
   * GET: / get all ultimate entities
   */
  router.get("/", wrapHandler(getUltimateEntities));

  /**
   * GET: /:ultimate-entity-id
   */
  router.get("/:ultimateEntityId", wrapHandler(getUltimateEntity));
};
