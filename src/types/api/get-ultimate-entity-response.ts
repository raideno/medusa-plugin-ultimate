import { UltimateEntity } from "../ultimate-entity";
import { UltimateEntityField } from "../ultimate-entity-field";
import { UltimateEntityRelation } from "../ultimate-entity-relation";

export interface GetUltimateEntityResponse {
  entity: {
    entity: UltimateEntity;
    fields: UltimateEntityField[];
    relations: UltimateEntityRelation[];
  };
}
