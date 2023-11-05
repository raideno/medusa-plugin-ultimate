import { UltimateEntity } from "../types/ultimate-entity";

export const ULTIMATE_ENTITY_METADATA_KEY_NAME = "ultimate-entity";

export default function UltimateEntity(data: Omit<UltimateEntity, "id" | "ordering">): ClassDecorator {
  return function (target: Function) {
    console.log("[medusa-plugin-ultimate](ultimate-entity):", target.name);

    const ultimateEntityMetadata: UltimateEntity | undefined = Reflect.getMetadata(ULTIMATE_ENTITY_METADATA_KEY_NAME, target) || {};

    Reflect.defineMetadata(ULTIMATE_ENTITY_METADATA_KEY_NAME, { ...data, ...ultimateEntityMetadata }, target);
  };
}
