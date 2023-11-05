import { Lifetime } from "awilix";
import { IEventBusService } from "@medusajs/types";
import { BaseEntity, TransactionBaseService } from "@medusajs/medusa";

/*----------*/

import { dataSource } from "@medusajs/medusa/dist/loaders/database";
import { UltimateEntity } from "../types/ultimate-entity";
import { UltimateEntityField } from "../types/ultimate-entity-field";
import { ULTIMATE_ENTITY_METADATA_KEY_NAME } from "../decorators/ultimate-entity";
import { ULTIMATE_ENTITY_FIELD_METADATA_KEY_NAME } from "../decorators/ultimate-entity-field";
import { EntityMetadata, EntityTarget, Repository } from "typeorm";
import { UltimateEntityFieldTypes } from "../types/ultimate-entity-field-types";
import { UltimateEntityModel } from "../types/ultimate-entity-model";
import { UltimateEntityRelation } from "../types/ultimate-entity-relation";
import { ULTIMATE_ENTITY_RELATION_METADATA_KEY_NAME } from "../decorators/ultimate-entity-relation";
import { UltimateEntityRelationTypes } from "../types/ultimate-entity-relation-types";
import { UltimateEntityObject } from "../types/ultimate-entity-object";

export default class UltimateEntityService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly eventBusService_: IEventBusService;

  constructor(
    { eventBusService }: { eventBusService: IEventBusService },
    options: Record<string, unknown>
  ) {
    // @ts-ignore
    super(...arguments);

    this.eventBusService_ = eventBusService;

    /**
     * options:
     *          -
     *          - enableUI
     *          - store-endpoint
     *          - admin-endpoint
     *          - side-bar (+ make it possible to side-bar on each class decorator)
     */
  }

  /**
   * list all available ultimate entities
   */

  getUltimateEntityMetadataAndTargetFromUltimateEntityId(
    ultimateEntityId: string
  ): [EntityMetadata, EntityTarget<UltimateEntityModel>] | undefined {
    let result:
      | [EntityMetadata, EntityTarget<UltimateEntityModel>]
      | undefined = undefined;

    for (let [entityTarget, entityMetadata] of dataSource.entityMetadatasMap) {
      if (entityMetadata.tableName === ultimateEntityId) {
        result = [entityMetadata, entityTarget];
        break;
      }
    }

    return result;
  }

  getUltimateEntityRepositoryFromUltimateEntityId(
    ultimateEntityId: string
  ): Repository<UltimateEntityModel> | undefined {
    const result =
      this.getUltimateEntityMetadataAndTargetFromUltimateEntityId(
        ultimateEntityId
      );

    if (result === undefined) return undefined;

    const [entityMetadata, entityTarget] = result;

    const genericEntityRepo =
      this.activeManager_.getRepository<UltimateEntityModel>(entityTarget);

    return genericEntityRepo;
  }

  getUltimateEntityRelationInverseRelationName(
    ultimateEntityId: string,
    relationName: string
  ) {
    /**
     * get the ultimate etntiy metadata
     */
    const [ultimateEntityMetadata, _] =
      this.getUltimateEntityMetadataAndTargetFromUltimateEntityId(
        ultimateEntityId
      );

    const relation = ultimateEntityMetadata.relations.find(
      (relation) => relation.propertyName === relationName
    );

    // IMPORTANT for one-to-many there is always a reverse relation
    // IMPORTANT for many-to-many it's always
    // IMPORTANT for one-to-one not always
    // IMPORTANT for many-to-one not always
    // this will be used for many-to-many and many-to-one so it's fine

    return relation.inverseRelation.propertyName;
  }

  listUltimateEntityRelations(
    entityMetadata: EntityMetadata,
    entityTarget: EntityTarget<UltimateEntityModel>
  ): UltimateEntityRelation[] {
    const relations = entityMetadata.relations
      .map((entityRelationMetadata) => {
        let ultimateEntityRelationMetadata:
          | UltimateEntityRelation
          | null
          | undefined = undefined;

        ULTIMATE_ENTITY_RELATION_METADATA_KEY_NAME;

        try {
          ultimateEntityRelationMetadata = Reflect.getMetadata(
            ULTIMATE_ENTITY_RELATION_METADATA_KEY_NAME,
            new (entityTarget as any)(),
            entityRelationMetadata.propertyName
          );
        } catch {
          ultimateEntityRelationMetadata = null;
        }

        if (
          !entityRelationMetadata ||
          entityRelationMetadata === null ||
          entityRelationMetadata === undefined
        )
          return null;

        return {
          id: entityRelationMetadata.propertyName,
          ...ultimateEntityRelationMetadata,
        };
      })
      .filter(
        (relation) => relation && relation !== null && relation !== undefined
      );

    return relations;
  }

  listUltimateEntityFields(
    entityMetadata: EntityMetadata,
    entityTarget: EntityTarget<UltimateEntityModel>
  ): UltimateEntityField[] {
    const fields = entityMetadata.columns
      .map((entityColumnMetadata) => {
        let ultimateEntityColumnMetadata:
          | UltimateEntityField
          | null
          | undefined = undefined;

        ULTIMATE_ENTITY_FIELD_METADATA_KEY_NAME;

        try {
          ultimateEntityColumnMetadata = Reflect.getMetadata(
            ULTIMATE_ENTITY_FIELD_METADATA_KEY_NAME,
            new (entityTarget as any)(),
            entityColumnMetadata.propertyName
          );
        } catch {
          ultimateEntityColumnMetadata = null;
        }

        if (
          !ultimateEntityColumnMetadata ||
          ultimateEntityColumnMetadata === undefined ||
          ultimateEntityColumnMetadata === null
        )
          return null;

        return {
          id: entityColumnMetadata.propertyName,
          ...ultimateEntityColumnMetadata,
        };

        // return {
        //   id: entityColumnMetadata.propertyName,
        //   ...(ultimateEntityColumnMetadata
        //     ? {
        //         type: ultimateEntityColumnMetadata.type,
        //         ...ultimateEntityColumnMetadata,
        //       }
        //     : {
        //         type: UltimateEntityFieldTypes.UNKNOWN,
        //       }),
        // };
      })
      .filter((field) => field && field !== null && field !== undefined);

    return fields;
  }

  listUltimateEntities(): UltimateEntityObject[] {
    const entities: UltimateEntityObject[] = [];

    ULTIMATE_ENTITY_METADATA_KEY_NAME;
    ULTIMATE_ENTITY_FIELD_METADATA_KEY_NAME;

    dataSource.entityMetadatasMap.forEach((entityMetadata, entityTarget) => {
      // entityTarget === the class

      const ultimateEntityDefaultId = entityMetadata.tableName;
      // replace "_" with " " and camelcase it
      const ultimateEntityDefaultName = entityMetadata.tableName;

      let ultimateEntityMetadata: UltimateEntity | null | undefined = undefined;

      try {
        ultimateEntityMetadata = Reflect.getMetadata(
          ULTIMATE_ENTITY_METADATA_KEY_NAME,
          entityTarget
        );
      } catch {
        ultimateEntityMetadata = null;
      }

      if (
        !ultimateEntityMetadata ||
        ultimateEntityMetadata === null ||
        ultimateEntityMetadata === undefined
      )
        return;

      const entity: UltimateEntityObject = {
        entity: {
          ...ultimateEntityMetadata,
          id: ultimateEntityDefaultId,
        },
        fields: this.listUltimateEntityFields(entityMetadata, entityTarget),
        relations: this.listUltimateEntityRelations(
          entityMetadata,
          entityTarget
        ),
      };

      entities.push(entity);
    });

    return entities;
  }

  retrieveUltimateEntity(ultimateEntityIdd: string): UltimateEntityObject | null {
    const ultimateEntities = this.listUltimateEntities();
    const ultimateEntity = ultimateEntities.find(
      (ultimateEntity) => ultimateEntity.entity.id === ultimateEntityIdd
    );
    return ultimateEntity;
  }
}
