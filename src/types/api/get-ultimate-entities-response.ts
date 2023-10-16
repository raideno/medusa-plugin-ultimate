import { UltimateEntity } from "../ultimate-entity";
import { UltimateEntityField } from "../ultimate-entity-field";

export interface GetUltimateEntitiesResponse {
  count: number;
  entities: {
    fields: UltimateEntityField[];
    entity: UltimateEntity;
  }[];
}
