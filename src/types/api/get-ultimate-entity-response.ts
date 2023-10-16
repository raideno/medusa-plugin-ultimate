import { UltimateEntity } from "../ultimate-entity";
import { UltimateEntityField } from "../ultimate-entity-field";

export interface GetUltimateEntityResponse {
  entity: {
    fields: UltimateEntityField[];
    entity: UltimateEntity;
  };
}
