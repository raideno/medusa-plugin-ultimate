import { Router } from "express";

import { wrapHandler } from "@medusajs/utils";

import areUltimateEntityDocumentsOrdered from "./are-ultimate-entity-documents-ordered";
import resetUltimateEntityDocumentsOrdering from "./reset-ultimate-entity-documents-ordering";
import getUltimateEntityDocumentOrderingPosition from "./get-ultimate-entity-document-ordering-position";
import getUltimateEntityDocumentsOrderingPositions from "./get-ultimate-entity-documents-ordering-positions";
import updateUltimateEntityDocumentOrderingPosition from "./update-ultimate-entity-document-ordering-position";
import getUltimateEntityDocumentsOrderingNextPosition from "./get-ultimate-entity-documents-ordering-next-position";


const router = Router();

export default (adminRouter: Router) => {
    adminRouter.use("/ultimate-entities", router);

    "/:ultimateEntityId/documents/:documentId"

    router.delete("/:ultimateEntityId/ordering", wrapHandler(resetUltimateEntityDocumentsOrdering));
    router.get("/:ultimateEntityId/ordering/are-ordered", wrapHandler(areUltimateEntityDocumentsOrdered));
    router.get("/:ultimateEntityId/ordering/next-position", wrapHandler(getUltimateEntityDocumentsOrderingNextPosition));

    router.put("/:ultimateEntityId/ordering/documents/:documentId", wrapHandler(updateUltimateEntityDocumentOrderingPosition));

    router.get("/:ultimateEntityId/ordering/documents", wrapHandler(getUltimateEntityDocumentsOrderingPositions));
    router.get("/:ultimateEntityId/ordering/documents/:documentId", wrapHandler(getUltimateEntityDocumentOrderingPosition));
};
