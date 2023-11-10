"use client";

import { Button, Label, Text, Tooltip } from "@medusajs/ui";
import { ArrowLeftMini, ArrowRightMini } from "@medusajs/icons";

import { UltimateEntity } from "../../../../../types/ultimate-entity";

import { useUltimateEntityDocumentsPage } from "../../../../contexts/ultimate-entity-documents-page";

import useEntityName from "../../../../hooks/use-entity-name";

import Skeleton from "../../../../components/layout/skeleton";

interface UltimateEntityDocumentsPagePaginationProps {
    entity: UltimateEntity;
}

const UltimateEntityDocumentsPagePagination = ({ entity }: UltimateEntityDocumentsPagePaginationProps) => {

    const { documents, error, isLoading } = useUltimateEntityDocumentsPage();

    async function handlePreviousPageButtonClick() {

    }

    async function handleNextPageButtonClick() {

    }

    if (isLoading)
        return (
            <div className="mt-xsmall w-full flex flex-row items-center justify-between gap-4">
                <Skeleton className="rounded h-8 w-[256px]" />
                <Skeleton className="rounded h-8 w-[256px]" />
            </div>
        )

    if (error)
        return null;

    if (documents.length === 0)
        return null;

    return (
        <div className="mt-xsmall w-full flex flex-row items-center justify-between gap-4">
            <div className="flex flex-row">
                <Text className="font-normal font-sans txt-medium inter-base-regular text-grey-50">{documents.length} of {documents.length} {useEntityName(entity)}(s).</Text>
            </div>
            <div className="flex flex-row items-center gap-2">
                <div className="flex flex-row items-center gap-1">
                    <Text className="font-normal font-sans txt-medium inter-base-regular text-grey-50">Page {1} of {1}</Text>
                </div>
                <div className="bg-white min-w-[64px] w-[64px] min-h-[32px] h-[32px] flex gap-0 flex-row items-center justify-center rounded border border-border overflow-hidden">
                    <Tooltip content="Previous Page.">
                        <Button
                            variant="transparent"
                            onClick={handlePreviousPageButtonClick}
                            className="bg-white peer-[data-state=checked]:opacity-100 hover:opacity-75 opacity-50 cursor-pointer h-[32px] min-w-[32px] w-[32px] flex flex-row items-center justify-center"
                        >
                            <ArrowLeftMini />
                        </Button>
                    </Tooltip>
                    <Tooltip content="Next Page.">
                        <Button
                            variant="transparent"
                            onClick={handleNextPageButtonClick}
                            className="bg-white border-r border-l border-border peer-[data-state=checked]:opacity-100 hover:opacity-75 opacity-50 cursor-pointer h-[32px] min-w-[32px] w-[32px] flex flex-row items-center justify-center"
                        >
                            <ArrowRightMini />
                        </Button>
                    </Tooltip>
                </div>
            </div>
        </div>
    )
}

export default UltimateEntityDocumentsPagePagination;