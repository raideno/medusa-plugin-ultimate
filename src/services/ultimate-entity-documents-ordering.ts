import { dataSource } from "@medusajs/medusa/dist/loaders/database";

import { Lifetime } from "awilix";

import { IEventBusService } from "@medusajs/types";
import { TransactionBaseService } from "@medusajs/medusa";

import { UltimateEntityDocument } from "../types/ultimate-entity-document";

import UltimateEntityService from "./ultimate-entity";
import { EntityManager } from "typeorm";
import UltimateEntityDocumentsService from "./ultimate-entity-documents";

const DEFAULT_ULTIMATE_ENTITY_DOCUMENT_POSITION = 0;

export default class UltimateEntityDocumentsOrderingService extends TransactionBaseService {

    static LIFE_TIME = Lifetime.SCOPED;
    protected readonly eventBusService_: IEventBusService;
    protected readonly ultimateEntityService_: UltimateEntityService;
    protected readonly ultimateEntityDocumentsService_: UltimateEntityDocumentsService;

    constructor(
        {
            eventBusService,
            ultimateEntityService,
            ultimateEntityDocumentsService
        }: {
            eventBusService: IEventBusService;
            ultimateEntityService: UltimateEntityService;
            ultimateEntityDocumentsService: UltimateEntityDocumentsService;
        },
        options: Record<string, unknown>
    ) {
        // @ts-ignore
        super(...arguments);

        this.eventBusService_ = eventBusService;
        this.ultimateEntityService_ = ultimateEntityService;
        this.ultimateEntityDocumentsService_ = ultimateEntityDocumentsService;
    }

    async isOrderingEnabled(ultimateEntityId: string): Promise<boolean> {
        const ultimateEntity = this.ultimateEntityService_.retrieveUltimateEntity(ultimateEntityId);

        if (!ultimateEntity || ultimateEntity === null)
            return false;

        return ultimateEntity.entity.ordering && ultimateEntity.entity.ordering.enabled
    }

    async getNextPosition(ultimateEntityId: string): Promise<number> {
        const isOrderedVerification = this.isOrderingValid(ultimateEntityId);

        // TODO: should we check that it's an ordered ultimate entity or it's granted ?
        // TODO: and if it's not should we throw an error or just return default value ?

        if (!isOrderedVerification) {
            // TODO: should we throw an error here ?
            return DEFAULT_ULTIMATE_ENTITY_DOCUMENT_POSITION;
        }

        const positions = await this.getDocumentsPositions(ultimateEntityId);

        if (Object.values(positions).length === 0)
            return DEFAULT_ULTIMATE_ENTITY_DOCUMENT_POSITION;

        const biggestPosition = Math.max(...Object.values(positions));

        return biggestPosition + 1;
    }

    async isOrderingValid(ultimateEntityId): Promise<boolean> {
        const isOrderingEnabledCheck = this.isOrderingEnabled(ultimateEntityId);

        if (!isOrderingEnabledCheck)
            return false;

        const positions = await this.getDocumentsPositions(ultimateEntityId);

        const integers = Object.values(positions).sort((a, b) => a - b);

        if (integers.length === 0)
            return true;

        const nonNullValuesCheck = !this.checkIfIntegersArrayHaveNulls(integers);

        if (!nonNullValuesCheck) {
            console.log("[integers-isOrdered]:", "false", "null value", integers);
            return false;
        }

        const nonDuplicateValuesCheck = !this.checkIfIntegersArrayHaveDuplicates(integers);

        if (!nonDuplicateValuesCheck) {
            console.log("[integers-isOrdered]:", "false", "duplicate value", integers);
            return false;
        }

        const checkIntegersArrayStartWithZero = this.checkIfIntegersArrayStartWithZero(integers);

        if (!checkIntegersArrayStartWithZero) {
            console.log("[integers-isOrdered]:", "false", "start with other value then zero", integers);
            return false;
        }

        const checkThereIsNoGapsInIntegersArray = !this.checkIfIntegersArrayHaveGaps(integers);

        if (!checkThereIsNoGapsInIntegersArray) {
            console.log("[integers-isOrdered]:", "false", "null value", integers);
            return false;
        }

        return true;
    };

    async resetOrder(ultimateEntityId: string): Promise<{ [documentId: string]: number }> {
        /**
         * update all documents positions to an incremental one from zero to n
         */

        const ultimateEntity = this.ultimateEntityService_.retrieveUltimateEntity(ultimateEntityId);

        if (!ultimateEntity) {
            console.log("[ultimate-entity-documents-ordering](resetOrder):", ultimateEntityId, "isn't a valid ultimate entity.")
            return;
        }

        if (ultimateEntity.entity.ordering === undefined || ultimateEntity.entity.ordering === null || !ultimateEntity.entity.ordering || !ultimateEntity.entity.ordering.enabled) {
            console.log("[ultimate-entity-documents-ordering](resetOrder):", ultimateEntity.entity.id, "isn't an ordered entity.")
            return;
        }

        const ultimateEntityRepository = this.ultimateEntityService_.getUltimateEntityRepositoryFromUltimateEntityId(ultimateEntityId);

        const documents = await ultimateEntityRepository.find({
            order: {
                [ultimateEntity.entity.ordering.positionPropertyName]: 'ASC',
            },
        });

        for (let i = 0; i < documents.length; i++) {
            documents[i][ultimateEntity.entity.ordering.positionPropertyName] = i;
        }

        await ultimateEntityRepository.save(documents);

        const result: { [documentId: string]: number | null } = {};

        documents.forEach((document) => {
            result[document.id] = document[ultimateEntity.entity.ordering.positionPropertyName] as number | null
        });

        return result;
    };

    async setPosition(ultimateEntityId: string, documentId: string, newPosition: number): Promise<void> {
        // TODO: check newPosition is a positive integer

        if (!Number.isInteger(newPosition) || newPosition < 0) {
            console.log("[ultimate-entity-documents-ordering](setPosition):", ultimateEntityId, newPosition, "must be a positive integer.")
            return;
        }

        const ultimateEntity = this.ultimateEntityService_.retrieveUltimateEntity(ultimateEntityId);

        if (!ultimateEntity) {
            console.log("[ultimate-entity-documents-ordering](setPosition):", ultimateEntityId, "isn't a valid ultimate entity.")
            return;
        }

        if (ultimateEntity.entity.ordering === undefined || ultimateEntity.entity.ordering === null || !ultimateEntity.entity.ordering || !ultimateEntity.entity.ordering.enabled) {
            console.log("[ultimate-entity-documents-ordering](setPosition):", ultimateEntity.entity.id, "isn't an ordered entity.")
            return;
        }

        if (!this.isOrderingValid(ultimateEntityId)) {
            console.log("[ultimate-entity-documents-ordering](setPosition):", ultimateEntity.entity.id, "ordering is invalid, reset it before executing this action.")
            return;
        }

        const [_, entity] = this.ultimateEntityService_.getUltimateEntityMetadataAndTargetFromUltimateEntityId(ultimateEntityId);

        const document = await this.ultimateEntityDocumentsService_.retrieve(ultimateEntityId, documentId);

        const currentPosition = document[ultimateEntity.entity.ordering.positionPropertyName]
        const positionShift = newPosition - currentPosition;

        await dataSource.transaction(async (transactionalEntityManager) => {
            const queryBuilder = transactionalEntityManager.createQueryBuilder();

            await queryBuilder
                .update(entity)
                .set({
                    [ultimateEntity.entity.ordering.positionPropertyName]: newPosition
                })
                .where("id = :id", { id: documentId })
                .execute();

            if (newPosition > currentPosition) {
                // Shift positions down for entities between current and new positions
                await queryBuilder
                    .update()
                    .set({ [ultimateEntity.entity.ordering.positionPropertyName]: () => `${[ultimateEntity.entity.ordering.positionPropertyName]} - 1` })
                    .where(`${[ultimateEntity.entity.ordering.positionPropertyName]} > :currentPosition AND ${[ultimateEntity.entity.ordering.positionPropertyName]} <= :newPosition AND id != :id`, { currentPosition, newPosition, id: document.id })
                    .execute();
            } else if (newPosition < currentPosition) {
                // Shift positions up for entities between new and current positions
                await queryBuilder
                    .update()
                    .set({ [ultimateEntity.entity.ordering.positionPropertyName]: () => `${[ultimateEntity.entity.ordering.positionPropertyName]} + 1` })
                    .where(`${[ultimateEntity.entity.ordering.positionPropertyName]} >= :newPosition AND ${[ultimateEntity.entity.ordering.positionPropertyName]} < :currentPosition AND id != :id`, { newPosition, currentPosition, id: document.id })
                    .execute();
            }
        });


        // await queryBuilder
        //     .update(entity)
        //     .set({
        //         [ultimateEntity.entity.ordering.positionPropertyName]: () => `${[ultimateEntity.entity.ordering.positionPropertyName]} + ${positionShift}`
        //     })
        //     .where(`${[ultimateEntity.entity.ordering.positionPropertyName]} > :position`, { position: newPosition })
        //     .execute();
        // });

        return;
    };

    async getDocumentsPositions(ultimateEntityId: string): Promise<{ [documentId: string]: number | null }> {
        const ultimateEntity = this.ultimateEntityService_.retrieveUltimateEntity(ultimateEntityId);

        if (!ultimateEntity) {
            console.log("[ultimate-entity-documents-ordering](getDocumentsPositions):", ultimateEntityId, "isn't a valid ultimate entity.")
            return {};
        }

        if (ultimateEntity.entity.ordering === undefined || ultimateEntity.entity.ordering === null || !ultimateEntity.entity.ordering || !ultimateEntity.entity.ordering.enabled) {
            console.log("[ultimate-entity-documents-ordering](getDocumentsPositions):", ultimateEntity.entity.id, "isn't an ordered entity.")
            return {};
        }

        const ultimateEntityRepository = this.ultimateEntityService_.getUltimateEntityRepositoryFromUltimateEntityId(ultimateEntityId);

        const documents = await ultimateEntityRepository.find({
            select: ["id", ultimateEntity.entity.ordering.positionPropertyName as keyof UltimateEntityDocument],
            order: {
                [ultimateEntity.entity.ordering.positionPropertyName]: "ASC",
            },
        });

        const result: { [documentId: string]: number | null } = {};

        documents.forEach((document) => {
            result[document.id] = document[ultimateEntity.entity.ordering.positionPropertyName] as number | null
        });

        return result
    };

    async getDocumentPosition(ultimateEntityId: string, documentId: string): Promise<number> {
        const ultimateEntity = this.ultimateEntityService_.retrieveUltimateEntity(ultimateEntityId);

        if (!ultimateEntity) {
            console.log("[ultimate-entity-documents-ordering](getDocumentsPositions):", ultimateEntityId, "isn't a valid ultimate entity.")
            return 0;
        }

        if (ultimateEntity.entity.ordering === undefined || ultimateEntity.entity.ordering === null || !ultimateEntity.entity.ordering || !ultimateEntity.entity.ordering.enabled) {
            console.log("[ultimate-entity-documents-ordering](getDocumentsPositions):", ultimateEntity.entity.id, "isn't an ordered entity.")
            return 0;
        }

        const ultimateEntityRepository = this.ultimateEntityService_.getUltimateEntityRepositoryFromUltimateEntityId(ultimateEntityId);

        const document = await ultimateEntityRepository.findOneBy({ id: documentId });

        if (!document || document === undefined || document === null)
            return 0;

        return document[ultimateEntity.entity.ordering.positionPropertyName];
    };

    async prepareDocumentForDelete(ultimateEntityId: string, documentId: string, transaction?: EntityManager): Promise<void> {
        /**
         * calling function have to open a transaction
         * we set the document position to null
         * we reorder other document positions
         * we return true
         * calling function delete document
         * calling function closes transaction
         */
        const ultimateEntity = this.ultimateEntityService_.retrieveUltimateEntity(ultimateEntityId);

        if (!ultimateEntity) {
            console.log("[ultimate-entity-documents-ordering](setPosition):", ultimateEntityId, "isn't a valid ultimate entity.")
            return;
        }

        if (ultimateEntity.entity.ordering === undefined || ultimateEntity.entity.ordering === null || !ultimateEntity.entity.ordering || !ultimateEntity.entity.ordering.enabled) {
            console.log("[ultimate-entity-documents-ordering](setPosition):", ultimateEntity.entity.id, "isn't an ordered entity.")
            return;
        }

        if (!this.isOrderingValid(ultimateEntityId)) {
            console.log("[ultimate-entity-documents-ordering](setPosition):", ultimateEntity.entity.id, "ordering is invalid, reset it before executing this action.")
            return;
        }

        const ultimateEntityRepository = this.ultimateEntityService_.getUltimateEntityRepositoryFromUltimateEntityId(ultimateEntityId);

        const document = await ultimateEntityRepository.findOneBy({ id: documentId });

        if (!document || document === undefined || document === null) {
            console.log("[ultimate-entity-documents-ordering](prepareDocumentForDelete):", ultimateEntity.entity.id, "invalid documentId provided.")
            return;
        }

        const [_, entity] = this.ultimateEntityService_.getUltimateEntityMetadataAndTargetFromUltimateEntityId(ultimateEntityId);

        const documentPosition = document[ultimateEntity.entity.ordering.positionPropertyName];

        if (transaction) {
            const queryBuilder = transaction.createQueryBuilder();

            await queryBuilder
                .update(entity)
                .set({
                    [ultimateEntity.entity.ordering.positionPropertyName]: null
                })
                .where("id = :id", { id: documentId })
                .execute();

            await queryBuilder
                .update(entity)
                .set({
                    [ultimateEntity.entity.ordering.positionPropertyName]: () => `${[ultimateEntity.entity.ordering.positionPropertyName]} - 1`
                })
                .where(`${[ultimateEntity.entity.ordering.positionPropertyName]} > :position`, { position: documentPosition })
                .execute();
        } else {
            await dataSource.transaction(async (transactionalEntityManager) => {
                const queryBuilder = transactionalEntityManager.createQueryBuilder();

                await queryBuilder
                    .update(entity)
                    .set({
                        [ultimateEntity.entity.ordering.positionPropertyName]: null
                    })
                    .where("id = :id", { id: documentId })
                    .execute();

                await queryBuilder
                    .update(entity)
                    .set({
                        [ultimateEntity.entity.ordering.positionPropertyName]: () => `${[ultimateEntity.entity.ordering.positionPropertyName]} - 1`
                    })
                    .where(`${[ultimateEntity.entity.ordering.positionPropertyName]} > :position`, { position: documentPosition })
                    .execute();
            });
        }

        // TODO: maybe return the updated document
        return;
    }

    private checkIfIntegersArrayHaveGaps(array: number[]): boolean {
        if (array.length === 0)
            return false;
        return array[0] + array.length != array[array.length - 1] + 1;
    }

    private checkIfIntegersArrayStartWithZero(array: number[]): boolean {
        return array[0] === 0;
    }

    private checkIfIntegersArrayHaveDuplicates(array: number[]): boolean {
        return (new Set(array)).size !== array.length;
    }

    private checkIfIntegersArrayHaveNulls(array: number[]): boolean {
        return array.filter((integer) => integer === null).length !== 0;
    }
}