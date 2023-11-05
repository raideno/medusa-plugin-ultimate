import { UpdateUltimateEntityDocumentOrderingPosition } from "../../../types/api/update-ultimate-entity-document-ordering-position";

import {
    BACKEND_URL,
    ULTIMATE_ENTITIES_BACKEND_PATH,
} from "../../config-values";

export default async (
    ultimateEntityId: string,
    documentId: string,
    newPosition: number
): Promise<UpdateUltimateEntityDocumentOrderingPosition> => {
    const response = await fetch(BACKEND_URL + ULTIMATE_ENTITIES_BACKEND_PATH + "/" + ultimateEntityId + "/ordering/documents/" + documentId, {
        method: "PUT",
        credentials: "include",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            position: newPosition
        })
    });

    let data = undefined;

    try {
        data = await response.json()
    } catch {
        console.log("[update-ultimate-entity-document-ordering-positions]:", "failed to convert to JSON.");
    }

    return data;
};
