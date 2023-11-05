import { MedusaError } from "@medusajs/utils";

import { UltimateEntity } from "../../../../types/ultimate-entity";
import { UltimateEntityField } from "../../../../types/ultimate-entity-field";

interface GetUltimateEntitiesResponse {
  entities: {
    entity: UltimateEntity;
    fields: UltimateEntityField;
  }[];
}

import { Request, Response } from "express";
import UltimateEntityService from "../../../../services/ultimate-entity";
import UltimateEntityDocumentsService from "../../../../services/ultimate-entity-documents";
import { DeleteUltimateEntityDocumentResponse } from "../../../../types/api/delete-ultimate-entity-document-response";
import UltimateEntityDocumentsOrderingService from "../../../../services/ultimate-entity-documents-ordering";

export default async (req: Request, res: Response): Promise<void> => {
  const ultimateEntityService: UltimateEntityService = req.scope.resolve(
    "ultimateEntityService"
  );
  const ultimateEntityDocumentsService: UltimateEntityDocumentsService =
    req.scope.resolve("ultimateEntityDocumentsService");
  const ultimateEntityDocumentsOrderingService: UltimateEntityDocumentsOrderingService =
    req.scope.resolve("ultimateEntityDocumentsOrderingService");

  // /:ultimateEntityId/documents/:documentId

  const ultimateEntityId = req.params["ultimateEntityId"];
  const ultimateEntityDocumentId = req.params["documentId"];

  /**
   * TODO: validate that ultimateEntityId isn't undefined
   * TODO: validate that ulitmateEntityId is a string
   * TODO: validate that ulitmateEntityId is a valid string
   */

  /**
   * TODO: validate that ultimateEntityId is the id of an existing ultimateEntity
   */
  const ultimateEntity =
    ultimateEntityService.retrieveUltimateEntity(ultimateEntityId);

  if (!ultimateEntity || ultimateEntity === undefined)
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Ultimate entity with id "${ultimateEntityId} don't exist.`
    );

  const document = await ultimateEntityDocumentsService.retrieve(
    ultimateEntityId,
    ultimateEntityDocumentId
  );

  if (!document || document === undefined || document === null)
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Document of type ${ultimateEntityId} with id "${ultimateEntityDocumentId} don't exist.`
    );

  // Properly remove document ordering if there is any
  if (ultimateEntity.entity.ordering && ultimateEntity.entity.ordering.enabled) {
    await ultimateEntityDocumentsOrderingService.prepareDocumentForDelete(ultimateEntity.entity.id, document.id);
  }

  await ultimateEntityDocumentsService.delete(
    ultimateEntityId,
    ultimateEntityDocumentId
  );

  let response: DeleteUltimateEntityDocumentResponse;

  res.status(200).json("OK");
};
