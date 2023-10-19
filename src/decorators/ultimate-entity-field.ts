/**
 *
 */

import { UltimateEntityField } from "../types/ultimate-entity-field";

export const ULTIMATE_ENTITY_FIELD_METADATA_KEY_NAME = "ultimate-entity-field";

export default function UltimateEntityField(
  data: Omit<UltimateEntityField, "id">
) {
  return function (target: Object, key: string | symbol) {
    Reflect.defineMetadata(
      ULTIMATE_ENTITY_FIELD_METADATA_KEY_NAME,
      data,
      target,
      key
    );
  };
}
