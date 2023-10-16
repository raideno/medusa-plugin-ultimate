import { UltimateEntity } from "../../../types/ultimate-entity";
import { GetUltimateEntityDocumentsResponse } from "../../../types/api/get-ultimate-entity-documents-response";
import {
  BACKEND_URL,
  ULTIMATE_ENTITIES_BACKEND_PATH,
} from "../../config-values";

// TODO: store that response in the types file
export default async (
  ultimateEntityId: string
): Promise<GetUltimateEntityDocumentsResponse> => {
  const response = await fetch(
    BACKEND_URL +
      ULTIMATE_ENTITIES_BACKEND_PATH +
      "/" +
      ultimateEntityId +
      "/" +
      "documents",
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data = await response.json();

  return data;
};
