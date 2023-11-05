import { useState } from "react";
import { orderBy } from "lodash";
import { ReactSortable, Sortable, Store } from "react-sortablejs";

import { ExclamationCircle, Spinner } from "@medusajs/icons";
import { Button, CodeBlock, Text, usePrompt, useToast } from "@medusajs/ui";


import { UltimateEntity } from "../../../../../types/ultimate-entity";
import { UltimateEntityModel } from "../../../../../types/ultimate-entity-model";
import { UltimateEntityDocument } from "../../../../../types/ultimate-entity-document";

import resetUltimateEntityDocumentsOrdering from "../../../../functions/ultimate-entites-documents-ordering/reset-ultimate-entity-documents-ordering";
import updateUltimateEntityDocumentOrderingPositions from "../../../../functions/ultimate-entites-documents-ordering/update-ultimate-entity-document-ordering-positions";

import { mutateUltimateEntityDocument } from "../../../../hooks/ultimate-entities-documents/use-ultimate-entity-document";
import { mutateUltimateEntityDocuments } from "../../../../hooks/ultimate-entities-documents/use-ultimate-entity-documents";

import useIsUltimateEntityDocumentsOrderingValid from "../../../../hooks/ultimate-entities-documents-ordering/use-is-ultimate-entity-documents-ordering-valid";

import Skeleton from "../../../../components/layout/skeleton";
import UltimateEntityDocumentCard, {
    UltimateEntityDocumentEditPages,
} from "../../../../components/ultimate-entity-document-card/ultimate-entity-document-card";

interface UltimateEntityDocumentsPageOrderableDocumentsProps {
    entity: UltimateEntity;
    documents: UltimateEntityDocument[];
}

const UltimateEntityDocumentsPageOrderableDocuments = ({
    entity,
    documents: documents_,
}: UltimateEntityDocumentsPageOrderableDocumentsProps) => {

    const prompt = usePrompt();

    const { toast } = useToast();

    const { data, isLoading, error, mutate: mutateOrderingValidityCheck } = useIsUltimateEntityDocumentsOrderingValid(entity.id);

    const [documents, setDocuments] = useState<UltimateEntityDocument[]>(documents_);

    const [isOrderingBeingReseted, setIsOrderingBeingReseted] = useState<boolean>(false);
    const [isDocumentPositionBeingUpdated, setIsDocumentPositionBeingUpdated] = useState<boolean>(false);

    async function onDocumentsOrderingChange(newDocuments: UltimateEntityModel[]) {
        if (isDocumentPositionBeingUpdated || isOrderingBeingReseted)
            return;

        const updatedDocuments = newDocuments.map((document, documentIndex) => ({ ...document, [entity.ordering.positionPropertyName]: documentIndex }));

        setDocuments(updatedDocuments);

        await mutateUltimateEntityDocuments(entity.id, async (oldData) => {
            return {
                documents: updatedDocuments,
                count: newDocuments.length
            };
        }, {
            populateCache: true,
            revalidate: false,
        });

        for (let i = 0; i < updatedDocuments.length; i++) {
            const document = updatedDocuments[i];
            await mutateUltimateEntityDocument(entity.id, document.id, async (oldData) => {
                return {
                    document: JSON.parse(JSON.stringify(document)) as typeof document
                };
            }, {
                populateCache: true,
                revalidate: false,
            });
        }
    }

    async function handleRetryOrderingValidity() {
        await mutateOrderingValidityCheck();
    }

    async function onDocumentDraggingEnd(event: Sortable.SortableEvent, sortable: Sortable, store: Store) {
        const documentId = event.item.id;

        const oldPosition = event.oldIndex;
        const newPosition = event.newIndex;

        if (oldPosition === newPosition)
            return;

        if (isDocumentPositionBeingUpdated || isOrderingBeingReseted)
            return;

        setIsDocumentPositionBeingUpdated(true);

        try {
            const result = await updateUltimateEntityDocumentOrderingPositions(entity.id, documentId, newPosition);

            toast({
                variant: "success",
                title: "Document Position Updated!",
                description: "If changes don't appear refresh the page."
            })
        } catch (err: any) {
            console.log("[medusa-plugin-ultimate](onDocumentDraggingEnd):", err);
            toast({
                variant: "error",
                title: "Failed to update document position!",
                description: "Check the console to know more or Try again."
            });
        } finally {
            setIsDocumentPositionBeingUpdated(false);
        }
    }

    async function resetOrdering() {
        if (isOrderingBeingReseted || isDocumentPositionBeingUpdated)
            return;

        const confirmation = await prompt({
            title: "We need confirmation!",
            description: "Doing this will completely reset your documents position.",
        });

        if (!confirmation)
            return;

        setIsOrderingBeingReseted(true);

        try {
            const newOrdering = await resetUltimateEntityDocumentsOrdering(entity.id);

            await mutateOrderingValidityCheck(async (oldData) => {
                return {
                    isOrderingValid: true,
                }
            }, { revalidate: false, populateCache: true })

            await mutateUltimateEntityDocuments(entity.id, async (oldData) => {
                return {
                    documents: oldData.documents.map((document) => ({ ...document, [entity.ordering.positionPropertyName]: newOrdering[document.id] })),
                    count: oldData.count,
                };
            }, {
                populateCache: true,
                revalidate: false,
            });

            for (let i = 0; i < documents.length; i++) {
                const document = documents[i];
                await mutateUltimateEntityDocument(entity.id, document.id, async (oldData) => {
                    return {
                        document: { ...oldData.document, [entity.ordering.positionPropertyName]: newOrdering[document.id] }
                    };
                }, {
                    populateCache: true,
                    revalidate: false
                })

            }

            toast({
                variant: "success",
                title: "Entity Documents Ordering Reseted!",
                description: "If changes don't appear refresh the page."
            })
        } catch (err: any) {
            console.log("[medusa-plugin-ultimate](resetOrdering):", err);
            toast({
                variant: "error",
                title: "Failed to reset ordering!",
                description: "Check the console to know more or Try again."
            })
        } finally {
            setIsOrderingBeingReseted(false);
        }
    }

    if (isLoading)
        return (
            <Skeleton className="py-8 px-4 flex flex-row items-center justify-center gap-2">
                <Spinner className="animate-spin" />
                <Text
                    className="font-normal font-sans txt-medium inter-base-regular text-grey-50"
                    size="small"
                >
                    Checking if ordering is valid... Please don't Refresh or Leave the page...
                </Text>
            </Skeleton>
        )

    if (error)
        return (
            <div className="py-8 px-4 flex flex-col items-center justify-center gap-2">
                <ExclamationCircle color="rgba(255,29,72,1)" />
                <Text
                    // className="font-normal font-sans txt-medium inter-base-regular text-grey-50"
                    className="text-center font-normal font-sans txt-medium inter-base-regular text-ui-fg-error"
                    size="small"
                >
                    Something went wrong while checking Ordering Validity, Check Network Tab to knwo mroe.
                </Text>
                <Button variant="secondary" onClick={handleRetryOrderingValidity}>Try Again</Button>
            </div>
        )

    const isOrderingValid = data.isOrderingValid;

    if (!isOrderingValid)
        return (
            <div className="p-2 w-full flex flex-col gap-2 rounded border border-ui-border-error">
                <Text className="text-ui-fg-error">
                    Documents Ordering Error, Invalid Document Found:
                </Text>
                <CodeBlock
                    snippets={[
                        {
                            language: "json",
                            label: "Metadata",
                            code: JSON.stringify(isOrderingValid, null, 2),
                        },
                    ]}
                >
                    <CodeBlock.Body />
                </CodeBlock>
                <Button disabled={isOrderingBeingReseted || isDocumentPositionBeingUpdated} isLoading={isOrderingBeingReseted} className="w-full" variant="danger" onClick={resetOrdering}>
                    Reset Ordering
                </Button>
            </div>
        )

    return (
        <ReactSortable disabled={isDocumentPositionBeingUpdated} onEnd={onDocumentDraggingEnd} list={orderBy(documents, [entity.ordering.positionPropertyName], ["asc"])} setList={onDocumentsOrderingChange} >
            {orderBy(documents, [entity.ordering.positionPropertyName], ["asc"]).map((document) => (
                <UltimateEntityDocumentCard
                    draggable
                    id={document.id}
                    entity={entity}
                    document={{ ...document, ...{ chosen: undefined, selected: undefined } }}
                    key={entity.id + "-" + document.id}
                    editPage={UltimateEntityDocumentEditPages.EXTERNAL}
                    className="mb-[calc(2*4px)]"
                />
            ))}
        </ReactSortable>
    )
}

export default UltimateEntityDocumentsPageOrderableDocuments;