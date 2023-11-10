import { UltimateEntity } from "../../../types/ultimate-entity";
import { GetUltimateEntityResponse } from "../../../types/api/get-ultimate-entity-response";
import {
  BACKEND_URL,
  ULTIMATE_ENTITIES_BACKEND_PATH,
} from "../../config-values";

// TODO: store that response in the types file
export default async (
  ultimateEntityId: string
): Promise<GetUltimateEntityResponse> => {
  const response = await fetch(
    BACKEND_URL + ULTIMATE_ENTITIES_BACKEND_PATH + "/" + ultimateEntityId,
    {
      method: "GET",
      credentials: "include",
    }
  );

  let data = undefined;

  try {
    data = await response.json()
  } catch {
    console.log("[medusa-plugin-ultimate](get-ultimate-entity):", "failed to convert to JSON.");
  }

  return data;
};
