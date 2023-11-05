import { Request, Response } from "express";

import { MedusaError } from "@medusajs/utils";

import UltimateEntityService from "../../../../services/ultimate-entity";
import UltimateEntityDocumentsService from "../../../../services/ultimate-entity-documents";
import UltimateEntityDocumentsOrderingService from "../../../../services/ultimate-entity-documents-ordering";

import { GetUltimateEntityDocumentsOrderingNextPosition } from "../../../../types/api/get-ultimate-entity-documents-ordering-next-position";

export default async (req: Request, res: Response): Promise<void> => {
    const ultimateEntityService: UltimateEntityService = req.scope.resolve(
        "ultimateEntityService"
    );
    const ultimateEntityDocumentsOrderingService: UltimateEntityDocumentsOrderingService = req.scope.resolve(
        "ultimateEntityDocumentsOrderingService"
    );
    const ultimateEntityDocumentsService: UltimateEntityDocumentsService =
        req.scope.resolve("ultimateEntityDocumentsService");

    const ultimateEntityId = req.params["ultimateEntityId"];

    const ultimateEntity =
        ultimateEntityService.retrieveUltimateEntity(ultimateEntityId);

    if (!ultimateEntity || ultimateEntity === undefined)
        throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `Ultimate entity with id "${ultimateEntityId} don't exist.`
        );

    const result = await ultimateEntityDocumentsOrderingService.getNextPosition(ultimateEntityId);

    res.status(200).json({ nextPosition: result });
};
