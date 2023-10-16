import { UltimateEntity } from "../../../types/ultimate-entity";
import { CreateUltimateEntityDocumentResponse } from "../../../types/api/create-ultimate-entity-document-response";
import { CreateUltimateEntityDocumentRequestBody } from "../../../types/api/create-ultimate-entity-document-request-body";
import {
  BACKEND_URL,
  ULTIMATE_ENTITIES_BACKEND_PATH,
} from "../../config-values";

// <body>
export default async (
  ultimateEntityId: string,
  body: CreateUltimateEntityDocumentRequestBody
): Promise<CreateUltimateEntityDocumentResponse> => {
  const response = await fetch(
    BACKEND_URL +
      ULTIMATE_ENTITIES_BACKEND_PATH +
      "/" +
      ultimateEntityId +
      "/" +
      "documents",
    {
      method: "POST",
      credentials: "include",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const data = await response.json();

  return data;
};
