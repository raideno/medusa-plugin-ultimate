import { snakeCase } from "lodash";

import { ClassConstructor } from "@medusajs/medusa";

import { UltimateEntityRelation } from "../types/ultimate-entity-relation";
import { UltimateEntityRelationTypes } from "../types/ultimate-entity-relation-types";

import { ULTIMATE_ENTITY_RELATION_METADATA_KEY_NAME } from "./ultimate-entity-relation";

interface Data extends Pick<UltimateEntityRelation, "group" | "note" | "name" | "description"> {
    /**
     * inverse relation property name
     */
    relationEntityPropertyName: string;
}

export default function UltimateEntityOneToManyRelation(
    relationEntity: ClassConstructor<any>,
    data: Data
): PropertyDecorator {
    return function (target: Object, key: string | symbol) {
        console.log("[medusa-plugin-ultimate](ultimate-entity-relation-one-to-many):", "from", target.constructor.name, "to", relationEntity.name, `(${snakeCase(relationEntity.name)})`);

        Reflect.defineMetadata(
            ULTIMATE_ENTITY_RELATION_METADATA_KEY_NAME,
            {
                type: UltimateEntityRelationTypes.ONE_TO_MANY_RELATION_SELECT,
                relationEntityId: snakeCase(relationEntity.name),
                relationEntityPropertyName: undefined,
                ...data,
            } as Omit<UltimateEntityRelation, "id">,
            target,
            key
        );
    };
}