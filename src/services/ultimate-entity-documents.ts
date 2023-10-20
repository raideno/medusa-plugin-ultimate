import { MedusaError } from "@medusajs/utils";
import { Lifetime } from "awilix";
import {
  BaseEntity,
  FindConfig,
  Selector,
  TransactionBaseService,
  buildQuery,
} from "@medusajs/medusa";
import { IEventBusService } from "@medusajs/types";

import UltimateEntityService from "./ultimate-entity";
import { UltimateEntityModel } from "../types/ultimate-entity-model";

export default class UltimateEntityDocumentsService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly eventBusService_: IEventBusService;
  protected readonly ultimateEntityService_: UltimateEntityService;

  constructor(
    {
      eventBusService,
      ultimateEntityService,
    }: {
      eventBusService: IEventBusService;
      ultimateEntityService: UltimateEntityService;
    },
    options: Record<string, unknown>
  ) {
    // @ts-ignore
    super(...arguments);

    this.eventBusService_ = eventBusService;
    this.ultimateEntityService_ = ultimateEntityService;
  }

  /**
   * get the ultimate-entity repo
   * => we will be given the ultimate entity id === ultimate entity table-name
   */

  async listAndCount(
    ultimateEntityId: string,
    selector?: Selector<UltimateEntityModel>,
    config: FindConfig<UltimateEntityModel> = {
      skip: 0,
      take: 20,
      relations: [],
    }
  ): Promise<[UltimateEntityModel[], number]> {
    const ultimateEntityRepository =
      this.ultimateEntityService_.getUltimateEntityRepositoryFromUltimateEntityId(
        ultimateEntityId
      );

    const query = buildQuery(selector || {}, config);

    return ultimateEntityRepository.findAndCount(query);
  }

  async retrieve(
    ultimateEntityId: string,
    ultimateEntityDocumentId: string,
    config?: FindConfig<UltimateEntityModel>
  ): Promise<UltimateEntityModel | null | undefined> {
    const ultimateEntityRepository =
      this.ultimateEntityService_.getUltimateEntityRepositoryFromUltimateEntityId(
        ultimateEntityId
      );

    const query = buildQuery(
      {
        id: ultimateEntityDocumentId,
      },
      config
    );

    const entity = await ultimateEntityRepository.findOne(query);

    return entity;
  }

  async delete(
    ultimateEntityId: string,
    ultimateEntityDocumentId: string
  ): Promise<void> {
    return await this.atomicPhase_(async (manager) => {
      const ultimateEntityRepository =
        this.ultimateEntityService_.getUltimateEntityRepositoryFromUltimateEntityId(
          ultimateEntityId
        );

      const genericEntity = await this.retrieve(
        ultimateEntityId,
        ultimateEntityDocumentId
      );

      await ultimateEntityRepository.remove([genericEntity]);
    });
  }

  async create(
    ultimateEntityId: string,
    data: Omit<UltimateEntityModel, "id" | "created_at" | "updated_at">
  ): Promise<UltimateEntityModel> {
    return this.atomicPhase_(async (manager) => {
      const ultimateEntityRepository =
        this.ultimateEntityService_.getUltimateEntityRepositoryFromUltimateEntityId(
          ultimateEntityId
        );

      const ultimateEntityDocument = ultimateEntityRepository.create();

      // assign data values to ultimateEntityDocument
      Object.keys(data).forEach((key) => {
        ultimateEntityDocument[key] = data[key];
      });

      const result = await ultimateEntityRepository.save(
        ultimateEntityDocument
      );

      return result;
    });
  }

  async update(
    ultimateEntityId: string,
    ultimateEntityDocumentId: string,
    data: Omit<Partial<UltimateEntityModel>, "id">
  ): Promise<UltimateEntityModel> {
    return await this.atomicPhase_(async (manager) => {
      const ultimateEntityRepository =
        this.ultimateEntityService_.getUltimateEntityRepositoryFromUltimateEntityId(
          ultimateEntityId
        );

      const ultimateEntityDocument = await this.retrieve(
        ultimateEntityId,
        ultimateEntityDocumentId
      );

      Object.assign(ultimateEntityDocument, data);

      return await ultimateEntityRepository.save(ultimateEntityDocument);
    });
  }

  /**
   * list all documents of an entity
   */

  /**
   * CRUD actions on entity documents
   */
}
