import { orderBy } from "lodash";
import { ChangeEvent, useState } from "react";

import {
  Button,
  FocusModal,
  Heading,
  Input,
  Label,
  RadioGroup,
  Select,
  Text,
  Tooltip,
  useToggleState,
} from "@medusajs/ui";

import { UltimateEntityDocument } from "../../../types/ultimate-entity-document";

import useUltimateEntity from "../../hooks/ultimate-entities/use-ultimate-entity";
import useUltimateEntityDocuments from "../../hooks/ultimate-entities-documents/use-ultimate-entity-documents";

import CreateUltimateEntityDocumentButton from "../create-ultimate-entity-document-button/create-ultimate-entity-document-button";

import UltimateEntityModalSelectOption from "./ultimate-entity-modal-select-option";
import useEntityName from "../../hooks/use-entity-name";
import { ArrowDownMini, ArrowUpMini } from "@medusajs/icons";
import { UltimateEntityFieldTypes } from "../ultimate-entity-field/field-controlers/boolean-control";
import useFieldName from "../../hooks/use-field-name";

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

interface UltimateEntityModalSelectProps {
  children: React.ReactNode;
  onSelectComplete?: (document: UltimateEntityDocument) => void;
  onSelectCancel?: () => void;
  ultimateEntityId: string;
  // show but not allowed to click them
  disabledDocumentsId?: string[];
  // don't show at all (usually used to say that documents are already selected)
  hiddenDocumentsIds?: string[];
  // tooltip content to show when hovering over a disabled document
  tooltipContent?: ({
    document,
  }: {
    document: UltimateEntityDocument;
  }) => string | React.ReactNode;

  getStatus?: (document: UltimateEntityDocument) => {
    text: string;
    isDisabled: boolean;
    type: "orange" | "red" | "grey" | "green";
  };

  documentCreationDefaultValues: any;
}

const UltimateEntityModalSelect = ({
  children: trigger,
  ultimateEntityId,
  disabledDocumentsId = [],
  hiddenDocumentsIds = [],
  onSelectCancel,
  onSelectComplete,
  tooltipContent,
  documentCreationDefaultValues,
  getStatus,
}: UltimateEntityModalSelectProps) => {
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

  const ultimateEntityDocumentsResponse =
    useUltimateEntityDocuments(ultimateEntityId);

  const ultimateEntityResponse = useUltimateEntity(ultimateEntityId);

  const {
    state: isModalOpen,
    close: closeModal,
    open: openModal,
    toggle: toggleModal,
  } = useToggleState();

  function handleCancelSelection() {
    onSelectCancel();
    closeModal();
  }

  function handleDocumentSelected(document: UltimateEntityDocument) {
    onSelectComplete(document);
    closeModal();
  }

  async function handleDocumentCreationComplete(
    document: UltimateEntityDocument
  ) {
    onSelectComplete(document);
    closeModal();
  }

  async function handleDocumentCreationCancel() {}

  function handleModalOpenChange(isOpen: boolean) {
    if (isOpen) openModal();
    else closeModal();
  }

  if (
    ultimateEntityDocumentsResponse.isLoading ||
    ultimateEntityResponse.isLoading
  )
    return (
      <div>
        <div>Loading</div>
      </div>
    );

  if (
    ultimateEntityDocumentsResponse.error ||
    !ultimateEntityDocumentsResponse.data ||
    ultimateEntityResponse.error ||
    !ultimateEntityResponse.data
  )
    return (
      <div>
        <div>Error</div>
      </div>
    );

  const { entity, fields, relations } = ultimateEntityResponse.data.entity;
  const documents = ultimateEntityDocumentsResponse.data.documents;

  const filteredDocuments = documents.filter((document) => {
    if (!filter || !filter.value || filter.value.trim() === "") return true;
    else
      return (document[filter.key] as string)
        .toLocaleLowerCase()
        .includes(filter.value.toLocaleLowerCase());
  });

  return (
    <FocusModal open={isModalOpen} onOpenChange={handleModalOpenChange}>
      <FocusModal.Trigger asChild>{trigger}</FocusModal.Trigger>
      <FocusModal.Content className="z-[199]">
        <FocusModal.Header>
          <Button variant="secondary" onClick={handleCancelSelection}>
            Cancel
          </Button>
        </FocusModal.Header>
        <FocusModal.Body className="flex flex-col items-center py-16 px-4 h-full overflow-y-auto">
          <div className="h-full overflow-y-auto flex w-full max-w-screen-lg flex-col gap-y-4">
            <div className="w-full flex flex-row items-center justify-between gap-4">
              <Heading>
                Select a Document of type {useEntityName(entity)}
              </Heading>

              <CreateUltimateEntityDocumentButton
                fields={fields}
                entity={entity}
                relations={relations}
                onCreationCancel={handleDocumentCreationCancel}
                onCreationComplete={handleDocumentCreationComplete}
                defaultValues={documentCreationDefaultValues}
                zIndex={299}
              >
                <Button variant="secondary">Create</Button>
              </CreateUltimateEntityDocumentButton>
            </div>

            <div className="w-full flex flex-row items-center justify-between gap-4">
              <div className="flex flex-row items-center gap-2">
                <Select
                  size="small"
                  value={filter.key}
                  onValueChange={handleFilterKeyChange}
                >
                  <Tooltip className="z-[299]" content="Field to search on.">
                    <Select.Trigger>
                      <Select.Value placeholder="Filter Field" />
                    </Select.Trigger>
                  </Tooltip>
                  <Select.Content className="z-[299]">
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
                          ].includes(field.type as any) || field.id === "id"
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
                  <Tooltip className="z-[299]" content="Sorting Field">
                    <Select.Trigger>
                      <Select.Value placeholder="Filter Field" />
                    </Select.Trigger>
                  </Tooltip>
                  <Select.Content className="z-[299]">
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
                          ].includes(field.type as any) || field.id === "id"
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
                  <Tooltip className="z-[299]" content="Ascending Order">
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
                  <Tooltip className="z-[299]" content="Descending Order">
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

            <div className="h-full flex flex-col gap-2">
              {orderBy(filteredDocuments, [sorting.field], [sorting.direction])
                .filter((document) => !hiddenDocumentsIds.includes(document.id))
                .map((document) => {
                  return (
                    <UltimateEntityModalSelectOption
                      document={document}
                      entity={entity}
                      onClick={
                        !disabledDocumentsId.includes(document.id) &&
                        handleDocumentSelected.bind(null, document)
                      }
                      key={"ultimate-entity-modal-select-item-" + document.id}
                      disabled={disabledDocumentsId.includes(document.id)}
                      status={getStatus ? getStatus(document) : undefined}
                    />
                  );
                })}
            </div>
          </div>
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  );
};

export default UltimateEntityModalSelect;
