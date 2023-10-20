import { partition, cloneDeep } from "lodash";
import { MedusaError } from "@medusajs/utils";

import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";

import { UltimateEntity } from "../../../../types/ultimate-entity";
import { UltimateEntityField } from "../../../../types/ultimate-entity-field";

/**
 * validate the body-data
 * - pass
 */

import { Request, Response } from "express";
import UltimateEntityService from "../../../../services/ultimate-entity";
import UltimateEntityDocumentsService from "../../../../services/ultimate-entity-documents";
import { UpdateUltimateEntityDocumentResponse } from "../../../../types/api/update-ultimate-entity-document-response";
import validateBodyKeys from "./utils/validate-body-keys";
import validateBodyFields from "./utils/validate-body-fields";
import validateBodyRelations from "./utils/validate-body-relations";

const EXCLUDED_KEYS = ["id", "created_at", "updated_at"];

export default async (req: Request, res: Response): Promise<void> => {
  const ultimateEntityService: UltimateEntityService = req.scope.resolve(
    "ultimateEntityService"
  );
  const ultimateEntityDocumentsService: UltimateEntityDocumentsService =
    req.scope.resolve("ultimateEntityDocumentsService");

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

  // check if the keys of req.body are all valid ones and are not part of the excluded ones
  // place the req.body keys inside of the document object
  // validate the document object

  const bodyKeysValidation = await validateBodyKeys(req.body, ultimateEntity);
  if (bodyKeysValidation.error)
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Body Keys Validation Errors`,
      undefined
    );

  const bodyFieldsValidation = await validateBodyFields(
    req.body,
    ultimateEntity
  );
  if (bodyFieldsValidation.error)
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Body Fields Validation Errors`,
      undefined
    );

  const bodyRelationsValidation = await validateBodyRelations(
    req.body,
    ultimateEntity
  );
  if (bodyRelationsValidation.error)
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Body Relations Validation Errors`,
      undefined
    );

  // TODO: validation is missing
  /**now everything in the body is valid, just construct the document again and update it */

  const newDocument = cloneDeep(document);

  bodyFieldsValidation.fields.forEach((allowedBodyField) => {
    newDocument[allowedBodyField] = req.body[allowedBodyField];
  });

  bodyRelationsValidation.relations.forEach((allowedBodyRelation) => {
    if (Array.isArray(req.body[allowedBodyRelation]))
      newDocument[allowedBodyRelation] = req.body[allowedBodyRelation].map(
        (id) => ({ id })
      );
    else {
      newDocument[allowedBodyRelation] = { id: req.body[allowedBodyRelation] };
    }
  });

  EXCLUDED_KEYS.forEach((excludedKey) => {
    delete newDocument[excludedKey];
  });

  const validationErrors = await validate(newDocument);

  if (validationErrors.length > 0)
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Validation errors`,
      undefined,
      validationErrors
    );

  // TODO: do separate updates, one for the fields and another one for the relations

  const newSavedDocument = await ultimateEntityDocumentsService.update(
    ultimateEntityId,
    ultimateEntityDocumentId,
    newDocument
  );

  const response: UpdateUltimateEntityDocumentResponse = {
    document: newSavedDocument,
  };

  res.status(200).send(response);
};
