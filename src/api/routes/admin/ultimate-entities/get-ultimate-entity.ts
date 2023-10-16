import { MedusaError } from "@medusajs/utils";

import { UltimateEntity } from "../../../../types/ultimate-entity";
import { UltimateEntityField } from "../../../../types/ultimate-entity-field";

import { Request, Response } from "express";
import UltimateEntityService from "../../../../services/ultimate-entity";
import { GetUltimateEntityResponse } from "../../../../types/api/get-ultimate-entity-response";

export default async (req: Request, res: Response): Promise<void> => {
  const ultimateEntityService: UltimateEntityService = req.scope.resolve(
    "ultimateEntityService"
  );

  const ultimateEntityId = req.params["ultimateEntityId"];

  /**
   * TODO: validate that ultimateEntityId isn't undefined
   * TODO: validate that ulitmateEntityId is a string
   * TODO: validate that ulitmateEntityId is a valid string
   */

  const ultimateEntity =
    ultimateEntityService.retrieveUltimateEntity(ultimateEntityId);

  if (!ultimateEntity || ultimateEntity === undefined)
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Ultimate entity with id "${ultimateEntityId} don't exist.`
    );

  const response: GetUltimateEntityResponse = {
    entity: ultimateEntity,
  };

  res.status(200).json(response);
};
