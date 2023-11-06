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
