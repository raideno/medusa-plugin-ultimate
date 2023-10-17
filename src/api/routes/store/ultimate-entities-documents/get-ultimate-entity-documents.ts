import { partition } from "lodash";
import { MedusaError } from "@medusajs/utils";

import UltimateEntityService from "../../../../services/ultimate-entity";
import { UltimateEntity } from "../../../../types/ultimate-entity";
import { UltimateEntityField } from "../../../../types/ultimate-entity-field";

import { Request, Response } from "express";
import UltimateEntityDocumentsService from "../../../../services/ultimate-entity-documents";
import { GetUltimateEntityDocumentsResponse } from "../../../../types/api/get-ultimate-entity-documents-response";

/**
 * returns:
 * - - documents
 * - - count
 * - - offset
 * - - limit
 */

const DEFAULT_KEYS_FILTER_OFFSET = 0;
const DEFAULT_KEYS_FILTER_LIMIT = 100;

type VALID_DEFAULT_FILTERING_KEYS = "offset" | "limit" | "order" | "q";

export default async (req: Request, res: Response): Promise<void> => {
  const ultimateEntityService: UltimateEntityService = req.scope.resolve(
    "ultimateEntityService"
  );
  const ultimateEntityDocumentsService: UltimateEntityDocumentsService =
    req.scope.resolve("ultimateEntityDocumentsService");

  // /:ultimateEntityId/documents

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

  /**
   * offset: check that it's a, unsigned integer
   * limit: check that it's an unsigned integer
   * order: check that it's one of the valid filtering keys
   * q: to search
   * expand: to expand other relations
   */

  const VALID_DEFAULT_FILTERING_KEYS: VALID_DEFAULT_FILTERING_KEYS[] = [
    "offset",
    "limit",
    "order",
    "q",
    // "expand",
    // "select"
  ];

  const VALID_ULTIMATE_ENTITY_FILTERING_KEYS = [
    ...ultimateEntity.fields.map((ultimateEntityField) => {
      return ultimateEntityField.id;
    }),
  ];

  /**
   * get the query-params keys
   * validate the query params keys
   * validate the query params keys's values
   */

  const filter = req.query || {};

  const givenFilteringKeys = Object.keys(filter);

  const invalidGivenFilteringKeys = givenFilteringKeys.filter(
    (givenFilteringKey) =>
      !VALID_ULTIMATE_ENTITY_FILTERING_KEYS.includes(givenFilteringKey) &&
      // "any"  is okey here since we are testing to check if it's the good type or no
      !VALID_DEFAULT_FILTERING_KEYS.includes(givenFilteringKey as any)
  );

  if (invalidGivenFilteringKeys.length > 0)
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Invalid filtering keys / query params given: ${invalidGivenFilteringKeys.join(
        ", "
      )}.`
    );

  /**
   * separate the ultimateEntityFilteringKeys from the defaultFilteringKeys
   */

  const [ultimateEntityFilteringKeys, defaultFilteringKeys] = partition(
    Object.keys(filter),
    (filteringKey) => {
      return VALID_ULTIMATE_ENTITY_FILTERING_KEYS.includes(filteringKey);
    }
  );

  /***
   * TODO: validate that ultimate entity filtering keys are coorect type
   * TODO: create ultimate entity filtering keys
   * TODO: validate that default entity filtering keys are all of valid type, where (order is one of the ultimateEntityFields, limit and offset are unsigned integers, q is a string and expand a single value or an array of values that are valid relations that the entity it self has)
   */

  const ultimateEntityKeysFilter = {};

  // TODO: validate that each type has a valid blablabla...
  ultimateEntityFilteringKeys.forEach((ultimateEntityFilteringKey) => {
    ultimateEntityKeysFilter[ultimateEntityFilteringKey] =
      filter[ultimateEntityFilteringKey];
  });

  const defaultKeysFilter: {
    // TODO: use a mapped object to give each key it's correct type
    [k in VALID_DEFAULT_FILTERING_KEYS]?: string | number | string[];
  } = {
    offset: DEFAULT_KEYS_FILTER_OFFSET,
    limit: DEFAULT_KEYS_FILTER_LIMIT,
  };

  (defaultFilteringKeys as VALID_DEFAULT_FILTERING_KEYS[]).forEach(
    (defaultFilteringKey) => {
      // TODO: add validation
      switch (defaultFilteringKey) {
        case "limit":
          defaultKeysFilter[defaultFilteringKey] = filter[
            defaultFilteringKey
          ] as any as number;
          break;
        case "offset":
          defaultKeysFilter[defaultFilteringKey] = filter[
            defaultFilteringKey
          ] as any as number;
          break;
        case "order":
          defaultKeysFilter[defaultFilteringKey] = (
            Array.isArray(filter[defaultFilteringKey])
              ? filter[defaultFilteringKey]
              : [filter[defaultFilteringKey]]
          ) as string[];
          break;
        case "q":
          break;

        default:
          throw new Error(
            "UnImplementend default filtering key: " + defaultFilteringKey
          );
          break;
      }
    }
  );

  console.log(ultimateEntityKeysFilter, defaultKeysFilter);

  const [documents, documentsCount] =
    await ultimateEntityDocumentsService.listAndCount(
      ultimateEntityId,
      ultimateEntityKeysFilter,
      {
        skip: defaultKeysFilter.offset as number,
        take: defaultKeysFilter.limit as number,
        order: defaultKeysFilter.order as string[] as any,
        // select: "",
        // relations: "",
      }
    );

  const response: GetUltimateEntityDocumentsResponse = {
    documents: documents,
    count: documentsCount,
  };

  res.status(200).json(response);
};
