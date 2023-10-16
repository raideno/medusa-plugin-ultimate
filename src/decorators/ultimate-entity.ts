/**
 * transform an entity into an ultimate entity
 */

import { UltimateEntity } from "../types/ultimate-entity";

export const ULTIMATE_ENTITY_METADATA_KEY_NAME = "ultimate-entity";

// UltimateEntityField
// function GenericEntityFieldType<T>
export default function UltimateEntity(data: Omit<UltimateEntity, "id">) {
  // return function(target: T)
  return function (target: Function) {
    Reflect.defineMetadata(ULTIMATE_ENTITY_METADATA_KEY_NAME, data, target);
    // Reflect.defineMetadata("key", "value", target);
  };
}
