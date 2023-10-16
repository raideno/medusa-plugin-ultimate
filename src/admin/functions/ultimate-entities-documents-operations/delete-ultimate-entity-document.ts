import { UltimateEntity } from "../../../types/ultimate-entity";
import { DeleteUltimateEntityDocumentResponse } from "../../../types/api/delete-ultimate-entity-document-response";
import {
  BACKEND_URL,
  ULTIMATE_ENTITIES_BACKEND_PATH,
} from "../../config-values";

// <body>
export default async (
  ultimateEntityId: string,
  ultimateEntityDocumentId: string
): Promise<DeleteUltimateEntityDocumentResponse> => {
  const response = await fetch(
    BACKEND_URL +
      ULTIMATE_ENTITIES_BACKEND_PATH +
      "/" +
      ultimateEntityId +
      "/" +
      "documents" +
      "/" +
      ultimateEntityDocumentId,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  return;
};
