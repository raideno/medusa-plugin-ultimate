import { UltimateEntity } from "../../../../types/ultimate-entity";
import { UltimateEntityField } from "../../../../types/ultimate-entity-field";

import { Request, Response } from "express";
import UltimateEntityService from "../../../../services/ultimate-entity";
import { GetUltimateEntitiesResponse } from "../../../../types/api/get-ultimate-entities-response";

export default async (req: Request, res: Response): Promise<void> => {
  const ultimateEntityService: UltimateEntityService = req.scope.resolve(
    "ultimateEntityService"
  );

  const ultimateEntities = ultimateEntityService.listUltimateEntities();

  const response: GetUltimateEntitiesResponse = {
    count: ultimateEntities.length,
    entities: ultimateEntities,
  };

  res.status(200).json(response);
};
