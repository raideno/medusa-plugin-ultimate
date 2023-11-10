"use client";

import { useState, useContext, createContext } from "react";

import { UltimateEntity } from "../../types/ultimate-entity";
import { UltimateEntityDocument } from "../../types/ultimate-entity-document";

import useUltimateEntityDocuments from "../hooks/ultimate-entities-documents/use-ultimate-entity-documents";

export enum SortingDirections {
    ASC = "asc",
    DESC = "desc",
}

export type Sorting = {
    field: keyof UltimateEntityDocument;
    direction: SortingDirections;
};

export type Filter = {
    field: keyof UltimateEntityDocument;
    value?: string | undefined;
}

const DEFAULT_SORTING_FIELD: Sorting["field"] = "updated_at"
const DEFAULT_SORTING_DIRECTION: Sorting["direction"] = SortingDirections.ASC

const DEFAULT_SORTING: Sorting = {
    field: DEFAULT_SORTING_FIELD,
    direction: DEFAULT_SORTING_DIRECTION,
};

const DEFAULT_FILTER_FIELD: Filter["field"] = "id"
const DEFAULT_FILTER_VALUE: Filter["value"] = ""

const DEFAULT_FILTER: Filter = {
    field: DEFAULT_FILTER_FIELD,
    value: DEFAULT_FILTER_VALUE,
}

interface UltimateEntityDocumentsPageContext {
    areDocumentsBeingReordered: boolean;
    setAreDocumentsBeingReordered: (areDocumentsBeingReordered: boolean) => void;

    documents?: UltimateEntityDocument[] | undefined;

    documentsSelectionManager: {
        selectedDocumentsIds: string[];

        isDocumentSelected: (documentId: string) => boolean
        selectDocument: (documentId: string) => boolean;
        unSelectDocument: (documentId: string) => boolean;
        toggleDocumentSelection: (documentId: string) => boolean;
        selectAllDocuments: () => boolean;
        unSelectAllDocuments: () => boolean;
    }

    isLoading: boolean;
    error: boolean;
    isValidating: boolean;

    filter: Filter;

    handleFilterFieldChange: (field: Filter["field"]) => void;
    handleFilterValueChange: (value: Filter["value"]) => void;

    sorting: Sorting;

    handleSortingDirectionChange: (direction: Sorting["direction"]) => void;
    handleSortingFieldChange: (field: Sorting["field"]) => void;
}

const UltimateEntityDocumentsPageContext =
    createContext<UltimateEntityDocumentsPageContext | null>(null);

interface UltimateEntityDocumentsPageProviderProps {
    children: React.ReactNode;
    ultimateEntity: UltimateEntity;
}

export const UltimateEntityDocumentsPageProvider = ({
    children,
    ultimateEntity
}: UltimateEntityDocumentsPageProviderProps) => {

    const { data, error, isLoading, isValidating } = useUltimateEntityDocuments(ultimateEntity.id);

    const [areDocumentsBeingReordered, setAreDocumentsBeingReordered] = useState<boolean>(false);

    const [selectedDocumentsIds, setSelectedDocumentsIds] = useState<string[]>([]);

    const [filter, setFilter] = useState<Filter>(DEFAULT_FILTER);
    const [sorting, setSorting] = useState<Sorting>(DEFAULT_SORTING);

    function handleFilterValueChange(value: Filter["value"]) {
        const newFilter = JSON.parse(JSON.stringify(filter)) as typeof filter;
        newFilter.value = value;
        setFilter(newFilter);
    }

    function handleFilterFieldChange(field: Filter["field"]) {
        const newFilter = JSON.parse(JSON.stringify(filter)) as typeof filter;
        newFilter.field = field;
        setFilter(newFilter);
    }

    function handleSortingDirectionChange(direction: Sorting["direction"]) {
        const newSorting = JSON.parse(JSON.stringify(sorting)) as typeof sorting;
        newSorting.direction = direction;
        setSorting(newSorting);
    }

    function handleSortingFieldChange(field: Sorting["field"]) {
        const newSorting = JSON.parse(JSON.stringify(sorting)) as typeof sorting;
        newSorting.field = field;
        setSorting(newSorting);
    }

    function isDocumentSelected(documentId: string): boolean {
        return selectedDocumentsIds.includes(documentId);
    }

    function selectDocument(documentId: string): boolean {
        if (isDocumentSelected(documentId))
            return false;
        const newSelectedDocuments = JSON.parse(JSON.stringify(selectedDocumentsIds)) as typeof selectedDocumentsIds;
        selectedDocumentsIds.push(documentId);
        setSelectedDocumentsIds(newSelectedDocuments);
        return true;
    }

    function unSelectDocument(documentId: string): boolean {
        if (!isDocumentSelected(documentId))
            return false;
        const newSelectedDocuments = JSON.parse(JSON.stringify(selectedDocumentsIds)) as typeof selectedDocumentsIds;
        const documentIndex = newSelectedDocuments.findIndex((docId) => docId === documentId);
        selectedDocumentsIds.splice(documentIndex, 1);
        setSelectedDocumentsIds(newSelectedDocuments);
        return true;
    }

    function toggleDocumentSelection(documentId: string): boolean {
        if (isDocumentSelected(documentId))
            unSelectDocument(documentId);
        else
            selectDocument(documentId);
        return true;
    }

    function selectAllDocuments(): boolean {
        const newSelectedDocuments = JSON.parse(JSON.stringify(selectedDocumentsIds)) as typeof selectedDocumentsIds;
        if (!data || data.documents)
            return false
        data.documents.forEach((document) => selectDocument(document.id));
        return true;
    }

    function unSelectAllDocuments(): boolean {
        const newSelectedDocuments = JSON.parse(JSON.stringify(selectedDocumentsIds)) as typeof selectedDocumentsIds;
        if (!data || data.documents)
            return false
        data.documents.forEach((document) => unSelectDocument(document.id));
        return true;
    }

    return (
        <UltimateEntityDocumentsPageContext.Provider
            value={{
                documents: data ? data.documents : undefined,
                error,
                isLoading,
                isValidating,

                areDocumentsBeingReordered,
                setAreDocumentsBeingReordered,

                filter,
                handleFilterFieldChange,
                handleFilterValueChange,

                sorting,
                handleSortingDirectionChange,
                handleSortingFieldChange,

                documentsSelectionManager: {
                    selectedDocumentsIds,
                    isDocumentSelected,
                    selectAllDocuments,
                    selectDocument,
                    toggleDocumentSelection,
                    unSelectAllDocuments,
                    unSelectDocument,
                }
            }}
        >
            {children}
        </UltimateEntityDocumentsPageContext.Provider>
    )

}

export const useUltimateEntityDocumentsPage = () => {
    const context = useContext(UltimateEntityDocumentsPageContext);

    if (context === null) {
        throw new Error(
            "useUltimateEntityDocumentsPage must be used within a UltimateEntityDocumentsPageProvider"
        );
    }
    return context;
};
