import { ResetUltimateEntityDocumentsOrdering } from "../../../types/api/reset-ultimate-entity-documents-ordering";
import { UltimateEntity } from "../../../types/ultimate-entity";
import {
    BACKEND_URL,
    ULTIMATE_ENTITIES_BACKEND_PATH,
} from "../../config-values";

export default async (
    ultimateEntityId: string,
): Promise<ResetUltimateEntityDocumentsOrdering> => {
    const response = await fetch(BACKEND_URL + ULTIMATE_ENTITIES_BACKEND_PATH + "/" + ultimateEntityId + "/ordering", {
        method: "DELETE",
        credentials: "include",
    });

    let data = undefined;

    try {
        data = await response.json()
    } catch {
        console.log("[reset-ultimate-entity-documents-ordering]:", "failed to convert to JSON.");
    }

    return data;
};
