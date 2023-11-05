import { MedusaError } from "@medusajs/utils";

import { validate } from "class-validator";

/**
 * validate the body-data
 * - pass
 */

import { Request, Response } from "express";
import UltimateEntityService from "../../../../services/ultimate-entity";
import UltimateEntityDocumentsService from "../../../../services/ultimate-entity-documents";
import { CreateUltimateEntityDocumentResponse } from "../../../../types/api/create-ultimate-entity-document-response";
import validateBodyKeys from "./utils/validate-body-keys";
import validateBodyFields from "./utils/validate-body-fields";
import validateBodyRelations from "./utils/validate-body-relations";
import UltimateEntityDocumentsOrderingService from "../../../../services/ultimate-entity-documents-ordering";

const EXCLUDED_KEYS = ["id", "created_at", "updated_at"];

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

  // if it's an ordered entity put the position field to undefined in order to pass validateBodyKeys, validateBodyFields, validateBodyRelations
  if (ultimateEntity.entity.ordering && ultimateEntity.entity.ordering.enabled) {
    req.body[ultimateEntity.entity.ordering.positionPropertyName] = undefined;
    delete req.body[ultimateEntity.entity.ordering.positionPropertyName];
  }

  const bodyKeysValidation = await validateBodyKeys(req.body, ultimateEntity);
  if (bodyKeysValidation.error)
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Body Keys Validation Errors: ${bodyKeysValidation.errors.map((err) => err.message)}`,
      undefined
    );

  const bodyFieldsValidation = await validateBodyFields(
    req.body,
    ultimateEntity
  );
  if (bodyFieldsValidation.error)
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Body Fields Validation Errors: ${bodyFieldsValidation.errors.map((err) => err.message)}`,
      undefined
    );

  const bodyRelationsValidation = await validateBodyRelations(
    req.body,
    ultimateEntity
  );
  if (bodyRelationsValidation.error)
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Body Relations Validation Errors: ${bodyRelationsValidation.errors.map((err) => err.message)}`,
      undefined
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

  bodyFieldsValidation.fields.forEach((allowedBodyField) => {
    document[allowedBodyField] = req.body[allowedBodyField];
  });

  bodyRelationsValidation.relations.forEach((allowedBodyRelation) => {
    document[allowedBodyRelation.id] = req.body[allowedBodyRelation.id];
  });

  // bodyRelationsValidation.relations.forEach((allowedBodyRelation) => {
  //   if (Array.isArray(req.body[allowedBodyRelation.id]))
  //     document[allowedBodyRelation.id] = req.body[allowedBodyRelation.id].map(
  //       (id) => ({ id })
  //     );
  //   else {
  //     document[allowedBodyRelation.id] = {
  //       id: req.body[allowedBodyRelation.id],
  //     };
  //   }
  // });

  EXCLUDED_KEYS.forEach((excludedKey) => {
    delete document[excludedKey];
  });

  const validationErrors = await validate(document);

  if (validationErrors.length > 0)
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Validation errors`,
      undefined
    );

  if (ultimateEntity.entity.ordering && ultimateEntity.entity.ordering.enabled) {
    const nextPosition = await ultimateEntityDocumentsOrderingService.getNextPosition(ultimateEntity.entity.id);
    document[ultimateEntity.entity.ordering.positionPropertyName] = nextPosition;
  }

  const newSavedDocument = await ultimateEntityDocumentsService.create(
    ultimateEntityId,
    document
  );

  const response: CreateUltimateEntityDocumentResponse = {
    document: newSavedDocument,
  };

  res.status(200).send(response);
};
