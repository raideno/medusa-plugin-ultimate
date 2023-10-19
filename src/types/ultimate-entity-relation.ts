import { UltimateEntityRelationTypes } from "./ultimate-entity-relation-types";

export type UltimateEntityRelationDefaultValueMap = {
  [UltimateEntityRelationTypes.ONE_TO_MANY_RELATION_SELECT]: string;
  [UltimateEntityRelationTypes.MANY_TO_ONE_RELATION_SELECT]: string[];
  [UltimateEntityRelationTypes.MANY_TO_MANY_RELATION_SELECT]: string[];
};

export type UltimateRelationWithType<T extends UltimateEntityRelationTypes> = {
  id: string;

  type: T;
  relationEntityId: string;

  note?: string;
  name?: string;
  description?: string;
};

export type UltimateEntityRelation =
  | UltimateRelationWithType<UltimateEntityRelationTypes.ONE_TO_MANY_RELATION_SELECT>
  | UltimateRelationWithType<UltimateEntityRelationTypes.MANY_TO_ONE_RELATION_SELECT>
  | UltimateRelationWithType<UltimateEntityRelationTypes.MANY_TO_MANY_RELATION_SELECT>;
