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

  const data = await response.json();

  return data;
};
