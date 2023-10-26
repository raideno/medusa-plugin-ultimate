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
import { UltimateEntityRelationTypes } from "../../../../types/ultimate-entity-relation-types";

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

  bodyRelationsValidation.relations.forEach((allowedBodyRelation) => {
    newDocument[allowedBodyRelation.id] = undefined;
    delete newDocument[allowedBodyRelation.id];
  });

  bodyFieldsValidation.fields.forEach((allowedBodyField) => {
    newDocument[allowedBodyField] = req.body[allowedBodyField];
  });

  /**
   * will be updated separately
   * * check the type of the relation first
   * * * if it's one-to-one or many-to-one it'll be updated allong with the other fields
   * * * if it's a many-to-many or a one-to-many it'll be updated differently
   */
  bodyRelationsValidation.relations.forEach((allowedBodyRelation) => {
    if (
      allowedBodyRelation.type ===
        UltimateEntityRelationTypes.MANY_TO_ONE_RELATION_SELECT ||
      allowedBodyRelation.type ===
        UltimateEntityRelationTypes.ONE_TO_ONE_RELATION_SELECT
    )
      newDocument[allowedBodyRelation.id as string] =
        req.body[allowedBodyRelation.id];
  });

  for (let i = 0; i < bodyRelationsValidation.relations.length; i++) {
    const allowedBodyRelation = bodyRelationsValidation.relations[i];
    if (
      allowedBodyRelation.type ===
      UltimateEntityRelationTypes.ONE_TO_MANY_RELATION_SELECT
    ) {
      const variable = req.body[allowedBodyRelation.id as string] as {
        id: string;
      }[];
      // child relation id
      // body[allowedBodyRelation.id] should be an array of this type [{ id: string }]
      /**
       * we gonna all the relations of the actual entity and set them to null first
       */
      const inverseEntityRelationName =
        ultimateEntityService.getUltimateEntityRelationInverseRelationName(
          ultimateEntityId,
          allowedBodyRelation.id
        );

      // console.log("[inverse-entity-relation-name]:", inverseEntityRelationName);
      // console.log(
      //   "[allowedBodyRelation.relationEntityId]:",
      //   allowedBodyRelation.relationEntityId
      // );
      // console.log("[allowedBodyRelation.id]:", allowedBodyRelation.id);

      // we list the inverse documents that have relations
      const [relatedTargetEntityRelations] =
        await ultimateEntityDocumentsService.listAndCount(
          allowedBodyRelation.relationEntityId,
          {
            [inverseEntityRelationName]: { id: document.id },
          }
        );

      // console.log(
      //   "[relatedTargetEntityRelations]:",
      //   relatedTargetEntityRelations
      // );

      // we set them to null to delete them
      for (let i = 0; i < relatedTargetEntityRelations.length; i++) {
        await ultimateEntityDocumentsService.update(
          allowedBodyRelation.relationEntityId,
          relatedTargetEntityRelations[i].id,
          {
            // all of them to null except the selected ones to document.id
            // [inverseEntityRelationName]: { id: null },
            [inverseEntityRelationName]: null,
          }
        );
      }

      // console.log("[variable]:", variable);

      // set
      for (let i = 0; i < variable.length; i++) {
        const updated = await ultimateEntityDocumentsService.update(
          allowedBodyRelation.relationEntityId,
          variable[i].id,
          {
            [inverseEntityRelationName]: document,
          }
        );
        // console.log("[updated]:", updated);
      }
    }

    // // many-to-many
    // if (
    //   allowedBodyRelation.type ===
    //   UltimateEntityRelationTypes.MANY_TO_MANY_RELATION_SELECT
    // ) {
    //   // TODO: implement
    // }
  }

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
