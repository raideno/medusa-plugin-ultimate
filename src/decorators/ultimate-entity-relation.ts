/**
 *
 */

import { UltimateEntityRelation } from "../types/ultimate-entity-relation";

export const ULTIMATE_ENTITY_RELATION_METADATA_KEY_NAME =
  "ultimate-entity-relation";

export default function UltimateEntityRelation(
  data: Omit<UltimateEntityRelation, "id">
): PropertyDecorator {
  return function (target: Object, key: string | symbol) {
    Reflect.defineMetadata(
      ULTIMATE_ENTITY_RELATION_METADATA_KEY_NAME,
      data,
      target,
      key
    );
  };
}
