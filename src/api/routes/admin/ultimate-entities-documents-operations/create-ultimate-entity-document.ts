import { partition, cloneDeep } from "lodash";
import { MedusaError } from "@medusajs/utils";

import { validate } from "class-validator";
import { plainToInstance, instanceToPlain } from "class-transformer";

import { UltimateEntity } from "../../../../types/ultimate-entity";
import { UltimateEntityField } from "../../../../types/ultimate-entity-field";

/**
 * validate the body-data
 * - pass
 */

interface GetUltimateEntitiesResponse {
  entities: {
    entity: UltimateEntity;
    fields: UltimateEntityField;
  }[];
}

import { Request, Response } from "express";
import UltimateEntityService from "../../../../services/ultimate-entity";
import UltimateEntityDocumentsService from "../../../../services/ultimate-entity-documents";
import { CreateUltimateEntityDocumentResponse } from "../../../../types/api/create-ultimate-entity-document-response";

const EXCLUDED_KEYS = ["id", "created_at", "updated_at"];

export default async (req: Request, res: Response): Promise<void> => {
  const ultimateEntityService: UltimateEntityService = req.scope.resolve(
    "ultimateEntityService"
  );
  const ultimateEntityDocumentsService: UltimateEntityDocumentsService =
    req.scope.resolve("ultimateEntityDocumentsService");

  // /:ultimateEntityId/documents/:documentId

  const ultimateEntityId = req.params["ultimateEntityId"];

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

  // const document = await ultimateEntityDocumentsService.retrieve(
  //   ultimateEntityId,
  //   ultimateEntityDocumentId
  // );

  // if (!document || document === undefined || document === null)
  //   throw new MedusaError(
  //     MedusaError.Types.NOT_FOUND,
  //     `Document of type ${ultimateEntityId} with id "${ultimateEntityDocumentId} don't exist.`
  //   );

  // check if the keys of req.body are all valid ones and are not part of the excluded ones
  // place the req.body keys inside of the document object
  // validate the document object

  const validDocumentKeys = ultimateEntity.fields
    .filter((field) => !EXCLUDED_KEYS.includes(field.id))
    .map((field) => field.id);

  const [notAllowedDocumentKeys, allowedDocumentKeys] = partition(
    Object.keys(req.body),
    (key) => !validDocumentKeys.includes(key)
  );

  if (notAllowedDocumentKeys.length > 0)
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Not allowed keys present on body: ${notAllowedDocumentKeys.join(", ")}.`
    );

  const ultimateEntityMetadataAndTarget =
    ultimateEntityService.getUltimateEntityMetadataAndTargetFromUltimateEntityId(
      ultimateEntityId
    );

  if (
    !ultimateEntityMetadataAndTarget ||
    ultimateEntityMetadataAndTarget === undefined ||
    ultimateEntityMetadataAndTarget === null
  )
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      `Something went wrong.`
    );

  const [_, UltimateEntityTarget] = ultimateEntityMetadataAndTarget;

  // TODO: implement default values here insertion
  // TODO: be very very carful with that
  let document: any = null;
  try {
    document = new (UltimateEntityTarget as any)();
  } catch (error) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      `Something went wrong.`
    );
  }

  EXCLUDED_KEYS.forEach((excludedKey) => {
    delete document[excludedKey];
  });

  allowedDocumentKeys.forEach((allowedDocumentKey) => {
    document[allowedDocumentKey] = req.body[allowedDocumentKey];
  });

  // TODO: implement validation controls

  const validationErrors = await validate(document);

  console.log("[validationErrors]:", validationErrors);

  if (validationErrors.length > 0)
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Validation errors`,
      undefined
    );

  const newSavedDocument = await ultimateEntityDocumentsService.create(
    ultimateEntityId,
    document
  );

  const response: CreateUltimateEntityDocumentResponse = {
    document: newSavedDocument,
  };

  res.status(200).send(response);
};
