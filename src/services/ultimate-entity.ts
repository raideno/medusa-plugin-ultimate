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

  listUltimateEntityFields(
    entityMetadata: EntityMetadata,
    entityTarget: EntityTarget<UltimateEntityModel>
  ): UltimateEntityField[] {
    const fields = entityMetadata.columns.map((entityColumnMetadata) => {
      let ultimateEntityColumnMetadata: UltimateEntityField | null | undefined =
        undefined;

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

      return {
        id: entityColumnMetadata.propertyName,
        ...(ultimateEntityColumnMetadata
          ? {
              type: ultimateEntityColumnMetadata.type,
              ...ultimateEntityColumnMetadata,
            }
          : {
              type: UltimateEntityFieldTypes.UNKNOWN,
            }),
      };
    });

    return fields;
  }

  listUltimateEntities() {
    const entities: {
      fields: UltimateEntityField[];
      entity: UltimateEntity;
    }[] = [];

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

      const entity: { fields: UltimateEntityField[]; entity: UltimateEntity } =
        {
          entity: {
            ...ultimateEntityMetadata,
            id: ultimateEntityDefaultId,
          },
          fields: this.listUltimateEntityFields(entityMetadata, entityTarget),
        };

      entities.push(entity);
    });

    return entities;
  }

  retrieveUltimateEntity(id: string):
    | {
        fields: UltimateEntityField[];
        entity: UltimateEntity;
      }
    | undefined {
    const ultimateEntities = this.listUltimateEntities();
    const ultimateEntity = ultimateEntities.find(
      (ultimateEntity) => ultimateEntity.entity.id === id
    );
    return ultimateEntity;
  }
}
