import { MedusaError } from "@medusajs/utils";

import { UltimateEntity } from "../../../../types/ultimate-entity";
import { UltimateEntityField } from "../../../../types/ultimate-entity-field";

import { Request, Response } from "express";
import UltimateEntityService from "../../../../services/ultimate-entity";
import UltimateEntityDocumentsService from "../../../../services/ultimate-entity-documents";
import { GetUltimateEntityDocumentResponse } from "../../../../types/api/get-ultimate-entity-document-response";

export default async (req: Request, res: Response): Promise<void> => {
  const ultimateEntityService: UltimateEntityService = req.scope.resolve(
    "ultimateEntityService"
  );
  const ultimateEntityDocumentsService: UltimateEntityDocumentsService =
    req.scope.resolve("ultimateEntityDocumentsService");

  // /:ultimateEntityId/documents/:documentId

  // TODO: add it to doc, if set to yes will extend all the ultimate relations
  const relations = req.params["relations"];

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
    ultimateEntityDocumentId,
    {
      relations: relations
        ? ultimateEntity.relations.map((relation) => relation.id)
        : undefined,
    }
  );

  if (!document || document === undefined || document === null)
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Document of type ${ultimateEntityId} with id "${ultimateEntityDocumentId} don't exist.`
    );

  const response: GetUltimateEntityDocumentResponse = {
    document,
  };

  res.status(200).json(response);
};
