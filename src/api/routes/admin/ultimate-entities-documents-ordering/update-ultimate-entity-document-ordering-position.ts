import { Request, Response } from "express";

import { MedusaError } from "@medusajs/utils";

import UltimateEntityService from "../../../../services/ultimate-entity";
import UltimateEntityDocumentsService from "../../../../services/ultimate-entity-documents";
import UltimateEntityDocumentsOrderingService from "../../../../services/ultimate-entity-documents-ordering";

import { UpdateUltimateEntityDocumentOrderingPosition } from "../../../../types/api/update-ultimate-entity-document-ordering-position"

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
    const documentId = req.params["documentId"];

    const ultimateEntity =
        ultimateEntityService.retrieveUltimateEntity(ultimateEntityId);

    if (!ultimateEntity || ultimateEntity === undefined)
        throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `Ultimate entity with id "${ultimateEntityId} don't exist.`
        );

    const position = req.body.position;

    if (typeof position !== "number" || !Number.isInteger(position) || position < 0)
        throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `Property 'position' on body must be a positive integer.`
        );

    await ultimateEntityDocumentsOrderingService.setPosition(ultimateEntityId, documentId, position);

    const result = await ultimateEntityDocumentsOrderingService.getDocumentsPositions(ultimateEntityId);

    res.status(200).json(result);
};
