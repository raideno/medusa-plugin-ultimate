import { UltimateEntity } from "../types/ultimate-entity";

export const ULTIMATE_ENTITY_METADATA_KEY_NAME = "ultimate-entity";

export default function UltimateEntity(data: Omit<UltimateEntity, "id">) {
  return function (target: Function) {
    console.log("[medusa-plugin-ultimate](ultimate-entity):", target.name);

    Reflect.defineMetadata(ULTIMATE_ENTITY_METADATA_KEY_NAME, data, target);
  };
}
