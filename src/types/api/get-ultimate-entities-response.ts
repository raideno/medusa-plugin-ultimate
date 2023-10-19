import { UltimateEntity } from "../ultimate-entity";
import { UltimateEntityField } from "../ultimate-entity-field";
import { UltimateEntityRelation } from "../ultimate-entity-relation";

export interface GetUltimateEntitiesResponse {
  count: number;
  entities: {
    entity: UltimateEntity;
    fields: UltimateEntityField[];
    relations: UltimateEntityRelation[];
  }[];
}
