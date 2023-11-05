import { cloneDeep } from "lodash";
import { ArrowUpRightOnBox, ChevronUpDown, Plus, XMark } from "@medusajs/icons";
import { Badge, IconButton, Select, Text, Tooltip, clx } from "@medusajs/ui";

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
import { UltimateEntityRelation } from "../../../../types/ultimate-entity-relation";
import { UltimateEntity } from "../../../../types/ultimate-entity";
import UltimateEntityModalSelect from "../../ultimate-entity-documents-modal-select.tsx/ultimate-entity-modal-select";
import useEntityName from "../../../hooks/use-entity-name";
import { Link } from "react-router-dom";
import getPagePathname from "../../../utils/get-page-pathname";

type HTMLElementType = HTMLSelectElement;

interface OneToManyRelationSelectControlProps
  extends Omit<
      React.InputHTMLAttributes<HTMLElementType>,
      "value" | "defaultValue" | "size" | "onChange"
    >,
    ControlProps<string[]> {
  relationEntityId: string;
  ultimateEntity: UltimateEntity;
  ultimateEntityRelation: UltimateEntityRelation;

  ultimateEntityDocument: UltimateEntityModel;
}

const DEFAULT_ONE_TO_MANY_SELECT_CONTROL_PLACEHOLDER = "Select a relation.";

const OneToManyRelationSelectControl = ({
  value,
  defaultValue,
  onValueChange,
  relationEntityId,

  ultimateEntityRelation,
  ultimateEntity,
  ultimateEntityDocument,

  ...props
}: OneToManyRelationSelectControlProps) => {
  const { data, isLoading, error, mutate } =
    useUltimateEntityDocuments(relationEntityId);

  const {
    data: entityData,
    error: entityError,
    isLoading: entityIsLoading,
  } = useUltimateEntity(relationEntityId);

  function removeDocument(documentId: string) {
    const newValue = cloneDeep(value);
    const documentIndex = newValue.findIndex((docId) => docId === documentId);
    if (documentIndex !== -1) newValue.splice(documentIndex, 1);
    onValueChange(newValue);
  }

  function addDocument(documentId: string) {
    const newValue = cloneDeep(value);
    newValue.push(documentId);
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
            return null;
          }

          return (
            <div
              className={clx(
                "w-full p-4 flex flex-row items-center justify-between gap-2 border border-border rounded"
              )}
            >
              <Tooltip content={"Selected Document"}>
                <div>
                  <Badge>{documentId}</Badge>
                </div>
              </Tooltip>
              <div className="flex flex-row items-center gap-2">
                <Tooltip content="Remove from Selected.">
                  <div
                    onClick={removeDocument.bind(null, documentId)}
                    className="aspect-square cursor-pointer hover:opacity-75 active:opacity-75"
                  >
                    <XMark />
                  </div>
                </Tooltip>
                <Tooltip content="Viiew Document Page">
                  <Link
                    target="_blank"
                    to={getPagePathname.entityDocument(
                      relationEntityId,
                      documentId
                    )}
                    className="aspect-square cursor-pointer hover:opacity-75 active:opacity-75"
                  >
                    <ArrowUpRightOnBox />
                  </Link>
                </Tooltip>
              </div>
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
          defaultValues={{
            [ultimateEntityRelation.relationEntityPropertyName]: {
              id: ultimateEntityDocument.id,
            },
          }}
        >
          <Tooltip content="Create a new document.">
            <div className="rounded border border-border cursor-pointer bg-ui-bg-field shadow-buttons-neutral min-h-[calc(4px*10)] h-[calc(4px*10)] max-h-[calc(4px*10)] min-w-[calc(4px*10)] w-[calc(4px*10)] max-w-[calc(4px*10)] flex flex-col items-center justify-center aspect-square hover:opacity-75 active:pacity-50 cursor-pointer">
              <Plus />
            </div>
          </Tooltip>
        </CreateUltimateEntityDocumentButton>
        {/* --- */}
        {/* TODO: filter, don't display the documents that are already selected */}
        {/* TODO: filter, put a tag on the ones used (owned) by other documents */}
        <UltimateEntityModalSelect
          ultimateEntityId={relationEntityId}
          disabledDocumentsId={[...value.map((docId) => docId)]}
          hiddenDocumentsIds={[]}
          onSelectCancel={() => null}
          onSelectComplete={(document) => addDocument(document.id)}
          // onSelectComplete={handleSelectionChange}
          documentCreationDefaultValues={{
            [ultimateEntityRelation.relationEntityPropertyName]: {
              id: ultimateEntityDocument.id,
            },
          }}
          getStatus={(document) => {
            /**
             * if it's already selected return that it's disabled with grey status and already selected text
             * if it's already selected by another one return disabled with warnning status and already selected bt another one disclaimer
             */
            if (value.includes(document.id))
              return {
                type: "grey",
                isDisabled: true,
                text: "Already Selected.",
              };

            console.log(
              "[CHECKING]:",
              document,
              ultimateEntityRelation.relationEntityPropertyName
            );

            if (document[ultimateEntityRelation.relationEntityPropertyName])
              return {
                type: "orange",
                isDisabled: false,
                text: "Selected By Another Instance.",
              };

            return {
              isDisabled: false,
              text: "Selectable.",
              type: "green",
            };
          }}
        >
          <div className="cursor-pointer bg-ui-bg-field shadow-buttons-neutral w-full h-10 border border-border rounded flex flex-row items-center justify-between p-2">
            <>
              <Text className="font-normal font-sans txt-medium inter-base-regular text-grey-50 whitespace-pre-wrap">
                Select from Existing {useEntityName({ id: relationEntityId })}
              </Text>
              <Tooltip content="Open Select">
                <div className="aspect-square cursor-pointer hover:opacity-75 active:opacity-75">
                  <ChevronUpDown />
                </div>
              </Tooltip>
            </>
          </div>
        </UltimateEntityModalSelect>
      </div>
    </div>
  );
};

export default OneToManyRelationSelectControl;
