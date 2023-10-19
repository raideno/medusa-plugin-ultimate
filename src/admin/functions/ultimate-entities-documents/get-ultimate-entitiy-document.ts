import { UltimateEntity } from "../../../types/ultimate-entity";
import { GetUltimateEntityDocumentResponse } from "../../../types/api/get-ultimate-entity-document-response";
import {
  BACKEND_URL,
  ULTIMATE_ENTITIES_BACKEND_PATH,
} from "../../config-values";

// TODO: store that response in the types file
export default async (
  ultimateEntityId: string,
  ultimateEntityDocumentId: string
): Promise<GetUltimateEntityDocumentResponse> => {
  const includeUltimateRelations = true;

  const response = await fetch(
    BACKEND_URL +
      ULTIMATE_ENTITIES_BACKEND_PATH +
      "/" +
      ultimateEntityId +
      "/" +
      "documents" +
      "/" +
      ultimateEntityDocumentId +
      `?relations=${includeUltimateRelations}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data = await response.json();

  return data;
};
