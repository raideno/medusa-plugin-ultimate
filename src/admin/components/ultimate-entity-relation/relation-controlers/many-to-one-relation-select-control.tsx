import { Badge, Select, Text, Tooltip } from "@medusajs/ui";
import { ControlProps } from ".";

import useUltimateEntityDocuments from "../../../hooks/ultimate-entities-documents/use-ultimate-entity-documents";

import ErrorLayout from "../../layout/error-layout";
import Skeleton from "../../layout/skeleton";
import CreateUltimateEntityDocumentButton from "../../create-ultimate-entity-document-button/create-ultimate-entity-document-button";
import { ChevronUpDown, Plus, XMark } from "@medusajs/icons";
import useDocumentName from "../../../hooks/use-document-name";
import useUltimateEntity from "../../../hooks/ultimate-entities/use-ultimate-entity";
import UltimateEntityModalSelect from "../../ultimate-entity-documents-modal-select.tsx/ultimate-entity-modal-select";
import { UltimateEntityDocument } from "../../../../types/ultimate-entity-document";
import { UltimateEntity } from "../../../../types/ultimate-entity";
import { UltimateEntityRelation } from "../../../../types/ultimate-entity-relation";
import useEntityName from "../../../hooks/use-entity-name";

type HTMLElementType = HTMLSelectElement;

interface ManyToOneRelationSelectControlProps
  extends Omit<
    React.InputHTMLAttributes<HTMLElementType>,
    "value" | "defaultValue" | "size" | "onChange"
  >,
  ControlProps<string> {
  relationEntityId: string;
  ultimateEntity: UltimateEntity;
  ultimateEntityRelation: UltimateEntityRelation;
  ultimateEntityDocument: UltimateEntityDocument;
}

const DEFAULT_ONE_TO_MANY_SELECT_CONTROL_PLACEHOLDER = "Select a document.";

const ManyToOneRelationSelectControl = ({
  value,
  defaultValue,
  onValueChange,
  relationEntityId,

  ultimateEntity,
  ultimateEntityDocument,
  ultimateEntityRelation,

  ...props
}: ManyToOneRelationSelectControlProps) => {
  // const { data, isLoading, error, mutate } =
  //   useUltimateEntityDocuments(relationEntityId);

  // const {
  //   data: entityData,
  //   error: entityError,
  //   isLoading: entityIsLoading,
  // } = useUltimateEntity(relationEntityId);

  function handleValueChange(value: string) {
    onValueChange(value);
  }

  function handleSelectionChange(document: UltimateEntityDocument) {
    handleValueChange(document.id);
  }

  function handleSelectDelete(
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) {
    event.preventDefault();
    event.stopPropagation();
    handleValueChange(null);
  }

  // async function handleCreateEntityAndAssign(document: UltimateEntityDocument) {
  //   await mutate({
  //     ...data,
  //     documents: [
  //       ...(JSON.parse(JSON.stringify(data.documents)) as typeof documents),
  //       document,
  //     ],
  //   });
  //   handleValueChange(document.id);
  //   // push the entity into the data array (selectable values)
  //   // assign the entity id into the value field via the handleValueChange function
  // }

  // if (isLoading) return <Skeleton className="w-full h-10" />;

  // if (error) return <ErrorLayout />;

  // if (entityIsLoading) return <Skeleton className="w-full h-10" />;

  // if (entityError) return <ErrorLayout />;

  // const documents = data.documents;

  // const { entity, fields, relations } = entityData.entity;

  return (
    <div>
      <UltimateEntityModalSelect
        ultimateEntityId={relationEntityId}
        disabledDocumentsId={[]}
        hiddenDocumentsIds={[]}
        onSelectCancel={() => null}
        onSelectComplete={handleSelectionChange}
        documentCreationDefaultValues={{
          [ultimateEntityRelation.relationEntityPropertyName]: [
            {
              id: ultimateEntityDocument.id,
            },
          ],
        }}
      >
        <div className="cursor-pointer bg-ui-bg-field shadow-buttons-neutral w-full h-10 border border-border rounded flex flex-row items-center justify-between p-2">
          {value ? (
            <>
              <Badge>{value}</Badge>
              <div className="flex flex-row items-center gap-2">
                <Tooltip content="Delete Selection">
                  <div
                    onClick={handleSelectDelete}
                    className="aspect-square cursor-pointer hover:opacity-75 active:opacity-75"
                  >
                    <XMark />
                  </div>
                </Tooltip>
                <Tooltip content="Open Select">
                  <div className="aspect-square cursor-pointer hover:opacity-75 active:opacity-75">
                    <ChevronUpDown />
                  </div>
                </Tooltip>
              </div>
            </>
          ) : (
            <>
              <Text className="font-normal font-sans txt-medium inter-base-regular text-grey-50 whitespace-pre-wrap">
                Select a {useEntityName({ id: relationEntityId })}
              </Text>
              <Tooltip content="Open Select">
                <div className="aspect-square cursor-pointer hover:opacity-75 active:opacity-75">
                  <ChevronUpDown />
                </div>
              </Tooltip>
            </>
          )}
        </div>
      </UltimateEntityModalSelect>
    </div>
  );
};

export default ManyToOneRelationSelectControl;
