import { ArrowDownMini, ArrowUpMini, Spinner } from "@medusajs/icons";
import { Input, Label, RadioGroup, Select, Tooltip } from "@medusajs/ui";

import { UltimateEntity } from "../../../../../types/ultimate-entity";
import { UltimateEntityField } from "../../../../../types/ultimate-entity-field";
import { UltimateEntityRelation } from "../../../../../types/ultimate-entity-relation";
import { UltimateEntityFieldTypes } from "../../../../../types/ultimate-entity-field-types";

import { SortingDirections, useUltimateEntityDocumentsPage } from "../../../../contexts/ultimate-entity-documents-page";

import useFieldName from "../../../../hooks/use-field-name";

import Skeleton from "../../../../components/layout/skeleton";

interface UltimateEntityDocumentsPageFilterProps {
    ultimateEntity: UltimateEntity;
    fields: UltimateEntityField[];
    relations: UltimateEntityRelation[];
}

const UltimateEntityDocumentsPageFilter = ({
    fields,
    relations,
    ultimateEntity,
}: UltimateEntityDocumentsPageFilterProps) => {

    const { isLoading, error, areDocumentsBeingReordered, filter, handleFilterFieldChange, handleFilterValueChange, sorting, handleSortingDirectionChange, handleSortingFieldChange } = useUltimateEntityDocumentsPage();

    if (isLoading)
        return (
            <div className="mb-xsmall w-full flex flex-row items-center justify-between gap-8">
                <Skeleton className="rounded h-8 w-80" />
                <Skeleton className="rounded h-8 w-64" />
            </div>
        );

    if (error)
        return null;

    return (
        <div className="mb-xsmall w-full flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-2">
                <Select
                    size="small"
                    value={filter.field}
                    onValueChange={handleFilterFieldChange}
                >
                    <Tooltip content="Field to search on.">
                        <Select.Trigger>
                            <Select.Value placeholder="Filter Field" />
                        </Select.Trigger>
                    </Tooltip>
                    <Select.Content>
                        <Select.Item key={"id"} value={"id"}>
                            {"Id"}
                        </Select.Item>
                        {fields
                            .filter(
                                (field) =>
                                    [
                                        UltimateEntityFieldTypes.STRING,
                                        UltimateEntityFieldTypes.TEXT,
                                        UltimateEntityFieldTypes.MARKDOWN,
                                        UltimateEntityFieldTypes.IMAGE,
                                        UltimateEntityFieldTypes.COLOR,
                                    ].includes(field.type) || field.id === "id"
                            )
                            .map((field) => (
                                <Select.Item key={field.id} value={field.id}>
                                    {useFieldName(field)}
                                </Select.Item>
                            ))}
                    </Select.Content>
                </Select>
                <Input
                    type="search"
                    size="small"
                    className="min-w-[256px]"
                    value={filter.value}
                    onChange={(event) => handleFilterValueChange(event.target.value)}
                    placeholder={`Search By ${filter.field}`}
                />
                {
                    areDocumentsBeingReordered && (
                        <Tooltip content="Updating Documents Order">
                            <Spinner className="animate-spin" />
                        </Tooltip>
                    )
                }
            </div>

            <div className="flex flex-row items-center gap-2">
                <Select
                    size="small"
                    value={sorting.field}
                    onValueChange={handleSortingFieldChange}
                >
                    <Tooltip content="Sorting Field">
                        <Select.Trigger>
                            <Select.Value placeholder="Filter Field" />
                        </Select.Trigger>
                    </Tooltip>
                    <Select.Content>
                        <Select.Item key={"created_at"} value={"created_at"}>
                            {"Creation Date"}
                        </Select.Item>
                        <Select.Item key={"updated_at"} value={"updated_at"}>
                            {"Last Update Date"}
                        </Select.Item>
                        <Select.Item key={"id"} value={"id"}>
                            {"Id"}
                        </Select.Item>
                        {fields
                            .filter(
                                (field) =>
                                    [
                                        UltimateEntityFieldTypes.STRING,
                                        UltimateEntityFieldTypes.TEXT,
                                        UltimateEntityFieldTypes.MARKDOWN,
                                        UltimateEntityFieldTypes.IMAGE,
                                        UltimateEntityFieldTypes.COLOR,
                                    ].includes(field.type) || field.id === "id"
                            )
                            .map((field) => (
                                <Select.Item key={field.id} value={field.id}>
                                    {useFieldName(field)}
                                </Select.Item>
                            ))}
                    </Select.Content>
                </Select>
                <RadioGroup
                    value={sorting.direction}
                    onValueChange={handleSortingDirectionChange}
                    className="gap-0 min-w-[64px] w-[64px] min-h-[32px] h-[32px] flex flex-row items-center justify-center rounded border border-border overflow-hidden"
                >
                    <Tooltip content="Ascending Order">
                        <Label
                            className="bg-white peer-[data-state=checked]:opacity-100 hover:opacity-75 opacity-50 cursor-pointer h-[32px] min-w-[32px] w-[32px] flex flex-row items-center justify-center"
                            htmlFor={"ultimate_entity-documents-sorting-ASC"}
                        >
                            <ArrowUpMini />
                        </Label>
                    </Tooltip>
                    <RadioGroup.Item
                        className="hidden sr-only peer"
                        value={SortingDirections.ASC}
                        id={"ultimate_entity-documents-sorting-ASC"}
                    />
                    <Tooltip content="Descending Order">
                        <Label
                            className="bg-white border-r border-l border-border peer-[data-state=checked]:opacity-100 hover:opacity-75 opacity-50 cursor-pointer h-[32px] min-w-[32px] w-[32px] flex flex-row items-center justify-center"
                            htmlFor={"ultimate_entity-documents-sorting-DESC"}
                        >
                            <ArrowDownMini />
                        </Label>
                    </Tooltip>
                    <RadioGroup.Item
                        className="hidden sr-only peer"
                        value={SortingDirections.DESC}
                        id={"ultimate_entity-documents-sorting-DESC"}
                    />
                </RadioGroup>
            </div>
        </div>
    )
}

export default UltimateEntityDocumentsPageFilter;