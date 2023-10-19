import { cloneDeep } from "lodash";
import { Plus, XMark } from "@medusajs/icons";
import { Badge, IconButton, Select, Tooltip } from "@medusajs/ui";

import { UltimateEntityModel } from "../../../../types/ultimate-entity-model";

import useDocumentName from "../../../hooks/use-document-name";
import useUltimateEntity from "../../../hooks/ultimate-entities/use-ultimate-entity";
import useUltimateEntityDocuments from "../../../hooks/ultimate-entities-documents/use-ultimate-entity-documents";
import CreateUltimateEntityDocumentButton from "../../create-ultimate-entity-document-button/create-ultimate-entity-document-button";

import Skeleton from "../../layout/skeleton";
import ErrorLayout from "../../layout/error-layout";

import { ControlProps } from ".";
import UltimateEntityDocumentCard, {
  UltimateEntityDocumentEditPages,
} from "../../ultimate-entity-document-card/ultimate-entity-document-card";

type HTMLElementType = HTMLSelectElement;

interface OneToManyRelationSelectControlProps
  extends Omit<
      React.InputHTMLAttributes<HTMLElementType>,
      "value" | "defaultValue" | "size" | "onChange"
    >,
    ControlProps<string[]> {
  relationEntityId: string;
}

const DEFAULT_ONE_TO_MANY_SELECT_CONTROL_PLACEHOLDER = "Select a relation.";

const OneToManyRelationSelectControl = ({
  value,
  defaultValue,
  onValueChange,
  relationEntityId,
  ...props
}: OneToManyRelationSelectControlProps) => {
  const { data, isLoading, error, mutate } =
    useUltimateEntityDocuments(relationEntityId);

  const {
    data: entityData,
    error: entityError,
    isLoading: entityIsLoading,
  } = useUltimateEntity(relationEntityId);

  // function handleValueChange(value: string) {
  //   onValueChange(value);
  // }

  function removeDocument(documentId: string) {
    const newValue = cloneDeep(value);
    const documentIndex = newValue.findIndex((docId) => docId === documentId);
    if (documentIndex !== -1) newValue.splice(documentIndex, 1);
    console.log("[old-new]", value, newValue);
    onValueChange(newValue);
  }

  function addDocument(documentId: string) {
    const newValue = cloneDeep(value);
    newValue.push(documentId);
    console.log("[old-new]", value, newValue);
    onValueChange(newValue);
  }

  async function handleCreateEntityAndAssign(document: UltimateEntityModel) {
    addDocument(document.id);
    await mutate({
      ...data,
      documents: [
        ...(JSON.parse(JSON.stringify(data.documents)) as typeof documents),
        document,
      ],
    });
    // handleValueChange should be a push to an array
    // handleValueChange(document.id);
    // push the entity into the data array (selectable values)
    // assign the entity id into the value field via the handleValueChange function
  }

  if (isLoading) return <Skeleton className="w-full h-10" />;

  if (error) return <ErrorLayout />;

  if (entityIsLoading) return <Skeleton className="w-full h-10" />;

  if (entityError) return <ErrorLayout />;

  const documents = data.documents;

  const { entity, fields, relations } = entityData.entity;

  return (
    // UltimateEntityDocumentsDrawerSelect
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        {value.map((documentId) => {
          const doc = documents.find((doc) => doc.id === documentId);

          if (!doc || doc === undefined || doc === null) {
            console.log("[invalid-doc]:", documentId, documents);
            return null;
          }

          return (
            <div className="relative" key={documentId}>
              <UltimateEntityDocumentCard
                document={doc}
                editPage={UltimateEntityDocumentEditPages.DRAWER}
                entity={entity}
              />
              <Badge
                onClick={removeDocument.bind(null, documentId)}
                className="cursor-pointer aspect-square absolute top-0 right-0 hover:opacity-75 hover:scale-95 active:opacity-50"
              >
                <XMark />
              </Badge>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-[auto_1fr] items-center gap-2">
        <CreateUltimateEntityDocumentButton
          entity={entity}
          fields={fields}
          relations={relations}
          onCreationCancel={() => undefined}
          onCreationComplete={handleCreateEntityAndAssign}
        >
          <Tooltip asChild content="Create a new document.">
            <Badge className="min-h-[calc(4px*10)] h-[calc(4px*10)] max-h-[calc(4px*10)] min-w-[calc(4px*10)] w-[calc(4px*10)] max-w-[calc(4px*10)] flex flex-col items-center justify-center aspect-square hover:opacity-75 active:pacity-50 cursor-pointer">
              <Plus />
            </Badge>
          </Tooltip>
        </CreateUltimateEntityDocumentButton>
        <Select onValueChange={addDocument}>
          <Select.Trigger
            placeholder={DEFAULT_ONE_TO_MANY_SELECT_CONTROL_PLACEHOLDER}
          >
            <Select.Value
              placeholder={DEFAULT_ONE_TO_MANY_SELECT_CONTROL_PLACEHOLDER}
            />
          </Select.Trigger>
          <Select.Content className="z-[999]">
            {/* TODO: filter, don't display the documents that are already selected */}
            {/* TODO: filter, put a tag on the ones used (owned) by other documents */}
            {documents.map((document, documentIndex) => {
              return (
                <Select.Item
                  value={document.id}
                  key={"select-one-to-many-relation-item-" + documentIndex}
                >
                  {useDocumentName(document)}
                </Select.Item>
              );
            })}
          </Select.Content>
        </Select>
      </div>
    </div>
  );
};

export default OneToManyRelationSelectControl;
