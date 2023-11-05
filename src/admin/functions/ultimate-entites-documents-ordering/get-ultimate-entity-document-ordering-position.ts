import { GetUltimateEntityDocumentOrderingPosition } from "../../../types/api/get-ultimate-entity-document-ordering-position";
import { UltimateEntity } from "../../../types/ultimate-entity";
import {
    BACKEND_URL,
    ULTIMATE_ENTITIES_BACKEND_PATH,
} from "../../config-values";

export default async (
    ultimateEntityId: string,
    documentId: string
): Promise<GetUltimateEntityDocumentOrderingPosition> => {
    const response = await fetch(BACKEND_URL + ULTIMATE_ENTITIES_BACKEND_PATH + "/" + ultimateEntityId + "/ordering/documents/" + documentId, {
        method: "GET",
        credentials: "include",
    });

    const data = await response.json();

    return data;
};
