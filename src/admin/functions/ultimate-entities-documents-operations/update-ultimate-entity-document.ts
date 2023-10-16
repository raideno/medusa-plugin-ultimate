import { UpdateUltimateEntityDocumentResponse } from "../../../types/api/update-ultimate-entity-document-response";
import { UpdateUltimateEntityDocumentRequestBody } from "../../../types/api/update-ultimate-entity-document-request-body";
import {
  BACKEND_URL,
  ULTIMATE_ENTITIES_BACKEND_PATH,
} from "../../config-values";

// <body>
export default async (
  ultimateEntityId: string,
  ultimateEntityDocumentId: string,
  body: UpdateUltimateEntityDocumentRequestBody
): Promise<UpdateUltimateEntityDocumentResponse> => {
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
      // ---
      method: "PUT",
      cache: "no-cache",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const data = await response.json();

  return data;
};
