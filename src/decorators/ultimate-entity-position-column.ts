/**
 *
 */

import { UltimateEntity } from "../types/ultimate-entity";
import { ULTIMATE_ENTITY_METADATA_KEY_NAME } from "./ultimate-entity";

export const ULTIMATE_ENTITY_POSITION_COLUMN_METADATA_KEY_NAME = "ultimate-entity-position-column";

export default function UltimateEntityPositionColumn(
): PropertyDecorator {
    return function (target: Object, key: string | symbol) {
        // const ultimateEntityMetadata: UltimateEntity | undefined = Reflect.getMetadata(ULTIMATE_ENTITY_METADATA_KEY_NAME, target);
        // const ultimateEntityMetadata: UltimateEntity | undefined = Reflect.getMetadata(ULTIMATE_ENTITY_METADATA_KEY_NAME, target) || {};
        const ultimateEntityMetadata: UltimateEntity | undefined = Reflect.getMetadata(ULTIMATE_ENTITY_METADATA_KEY_NAME, target.constructor) || {};

        if (!ultimateEntityMetadata || ultimateEntityMetadata === undefined) {
            // TODO: start a big error to tell that the decorator have been used in a non ultimate class
            console.log("[medusa-plugin-ultimate](ultimate-entity-position-column):", "ERROR:", `${target.constructor.name} isn't an ultimate-entity.`)
            return;
        }

        if (ultimateEntityMetadata.ordering) {
            console.log("[medusa-plugin-ultimate](ultimate-entity-position-column):", "ERROR:", `UltimateEntityPositionColumn have already been set on ${target.toString()} ultimate-entity.`)
            return;
        }

        ultimateEntityMetadata.ordering = {
            enabled: true,
            positionPropertyName: key.toString()
        }

        console.log("[medusa-plugin-ultimate](ultimate-entity-position-column):", "set on", target.constructor.name, key);

        Reflect.defineMetadata(ULTIMATE_ENTITY_METADATA_KEY_NAME, ultimateEntityMetadata, target.constructor);
    };
}
