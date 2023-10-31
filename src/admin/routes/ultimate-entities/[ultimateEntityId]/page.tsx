import { useState, ChangeEvent } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { RouteProps } from "@medusajs/admin";
import {
  Toaster,
  Button,
  Input,
  Select,
  RadioGroup,
  Label,
  Tooltip,
} from "@medusajs/ui";

import getPagePathname from "../../../utils/get-page-pathname";

import { UltimateEntityDocument } from "../../../../types/ultimate-entity-document";

import useEntityName from "../../../hooks/use-entity-name";
import useUltimateEntity from "../../../hooks/ultimate-entities/use-ultimate-entity";

import Skeleton from "../../../components/layout/skeleton";
import ErrorLayout from "../../../components/layout/error-layout";
import UltimateEntityPageHeader from "../../../components/layout/ultimate-entity-page-header";
import UltiamteEntityPageGoBackButton from "../../../components/layout/ultimate-entity-page-go-back-button";
import UltimateEntityDocumentsPageDocuments from "./components/ultimate-entity-documents-page-documents";
import CreateUltimateEntityDocumentButton from "../../../components/create-ultimate-entity-document-button/create-ultimate-entity-document-button";
import useFieldName from "../../../hooks/use-field-name";
import { UltimateEntityFieldTypes } from "../../../../types/ultimate-entity-field-types";
import { ArrowDownMini, ArrowUpMini } from "@medusajs/icons";

enum SortingDirections {
  ASC = "asc",
  DESC = "desc",
}

type Sorting = {
  field: string;
  direction: SortingDirections;
};

const DEFAULT_SORTING: Sorting = {
  field: "updated_at",
  direction: SortingDirections.ASC,
};

const UltimateEntityDocumentsPage = ({ notify }: RouteProps) => {
  const navigate = useNavigate();

  const [filter, setFilter] = useState<{
    key: string;
    value?: string | undefined;
  }>({ key: "id", value: "" });

  const [sorting, setSorting] = useState<Sorting>(DEFAULT_SORTING);

  function handleFilterValueChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    const newFilter = JSON.parse(JSON.stringify(filter)) as typeof filter;
    newFilter.value = value;
    setFilter(newFilter);
  }

  function handleFilterKeyChange(newKey: string) {
    const newFilter = JSON.parse(JSON.stringify(filter)) as typeof filter;
    newFilter.key = newKey;
    setFilter(newFilter);
  }

  function handleSortingDirectionChange(direction: SortingDirections) {
    const newSorting = (JSON.parse(
      JSON.stringify(
        sorting || { direction: SortingDirections.ASC, field: "updated_at" }
      )
    ) as typeof sorting)!;
    newSorting.direction = direction;
    setSorting(newSorting);
  }

  function handleSortingFieldChange(sortingField: string) {
    const newSorting = (JSON.parse(
      JSON.stringify(
        sorting || { direction: SortingDirections.ASC, field: "updated_at" }
      )
    ) as typeof sorting)!;
    newSorting.field = sortingField;
    setSorting(newSorting);
  }

  const { ultimateEntityId } = useParams();

  const {
    data: ultimateEntityData,
    isLoading: isUltimateEntityDataLoading,
    error: isUltimateEntityDataError,
  } = useUltimateEntity(ultimateEntityId);

  async function handleDocumentCreationComplete(
    document: UltimateEntityDocument
  ) {
    navigate(getPagePathname.entityDocument(ultimateEntityId, document.id));
  }

  if (isUltimateEntityDataLoading)
    return (
      <div className="w-full">
        <Skeleton className="mb-xsmall w-64 h-8" />
        <Skeleton className="mb-xlarge w-full h-[72px]" />
        <div className="w-full flex flex-col gap-2">
          <div className="w-full flex flex-row items-center justify-end">
            <Skeleton className="mb-xsmall w-64 h-8" />
          </div>
          <Skeleton className="w-full h-[50vh]" />
        </div>
      </div>
    );

  if (isUltimateEntityDataError || !ultimateEntityData) {
    return <ErrorLayout />;
  }

  const entity = ultimateEntityData.entity.entity;
  const fields = ultimateEntityData.entity.fields;
  const relations = ultimateEntityData.entity.relations;

  return (
    <>
      <div>
        <div className="flex flex-row items-center justify-between">
          <UltiamteEntityPageGoBackButton
            children="Go back to ultimate entities."
            href={getPagePathname.entities()}
          />

          {!entity.isBuiltInEntity ? (
            <CreateUltimateEntityDocumentButton
              entity={entity}
              fields={fields}
              relations={relations}
              onCreationComplete={handleDocumentCreationComplete}
            >
              <Button variant="secondary" type="reset">
                Create Document
              </Button>
            </CreateUltimateEntityDocumentButton>
          ) : (
            <div />
          )}
        </div>
        <UltimateEntityPageHeader
          title={`${useEntityName(entity)} Documents`}
          // TODO: make a helper unction that'll automatically get the ultimate entity name and capitalize it
          description={`${useEntityName(entity)} ultimate entity documents.`}
        />
        <div className="mb-xsmall w-full flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-2">
            <Select
              size="small"
              value={filter.key}
              onValueChange={handleFilterKeyChange}
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
              onChange={handleFilterValueChange}
              placeholder={`Search By ${filter.key}`}
            />
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
        <div className="flex flex-col gap-y-xsmall">
          <UltimateEntityDocumentsPageDocuments
            filter={filter}
            sorting={sorting}
            entity={entity}
          />
        </div>
        <div className="h-xlarge w-full" />
      </div>
      <Toaster />
    </>
  );
};

export default UltimateEntityDocumentsPage;
