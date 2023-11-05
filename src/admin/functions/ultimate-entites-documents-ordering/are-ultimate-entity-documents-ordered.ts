import { AreUltimateEntityDocumentsOrdered } from "../../../types/api/are-ultimate-entity-documents-ordered";
import { UltimateEntity } from "../../../types/ultimate-entity";
import {
    BACKEND_URL,
    ULTIMATE_ENTITIES_BACKEND_PATH,
} from "../../config-values";

export default async (
    ultimateEntityId: string,
): Promise<AreUltimateEntityDocumentsOrdered> => {
    const response = await fetch(BACKEND_URL + ULTIMATE_ENTITIES_BACKEND_PATH + "/" + ultimateEntityId + "/ordering/are-ordered", {
        method: "GET",
        credentials: "include",
    });

    const data = await response.json();

    return data;
};
