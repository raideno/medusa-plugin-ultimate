import { UltimateEntity } from "../../../types/ultimate-entity";
import { GetUltimateEntitiesResponse } from "../../../types/api/get-ultimate-entities-response";
import {
  BACKEND_URL,
  ULTIMATE_ENTITIES_BACKEND_PATH,
} from "../../config-values";

// TODO: store that response in the types file
export default async (): Promise<GetUltimateEntitiesResponse> => {
  const response = await fetch(BACKEND_URL + ULTIMATE_ENTITIES_BACKEND_PATH, {
    method: "GET",
    credentials: "include",
  });

  let data = undefined;

  try {
    data = await response.json()
  } catch {
    console.log("[medusa-plugin-ultimate](get-ultimate-entities):", "failed to convert to JSON.");
  }

  return data;
};
