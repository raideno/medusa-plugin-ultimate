import { ChevronUpDown, Plus, XMark } from "@medusajs/icons";
import { Badge, IconButton, Select, Tooltip } from "@medusajs/ui";

import { UltimateEntityModel } from "../../../../types/ultimate-entity-model";

import useDocumentName from "../../../hooks/use-document-name";
import useUltimateEntity from "../../../hooks/ultimate-entities/use-ultimate-entity";
import useUltimateEntityDocuments from "../../../hooks/ultimate-entities-documents/use-ultimate-entity-documents";
import CreateUltimateEntityDocumentButton from "../../create-ultimate-entity-document-button/create-ultimate-entity-document-button";

import Skeleton from "../../layout/skeleton";
import ErrorLayout from "../../layout/error-layout";

import { ControlProps } from ".";
import UltimateEntityModalSelect from "../../ultimate-entity-documents-modal-select.tsx/ultimate-entity-modal-select";
import { UltimateEntityDocument } from "../../../../types/ultimate-entity-document";
import { UltimateEntity } from "../../../../types/ultimate-entity";
import { UltimateEntityRelation } from "../../../../types/ultimate-entity-relation";

type HTMLElementType = HTMLSelectElement;

interface OneToOneRelationSelectControlProps
  extends Omit<
      React.InputHTMLAttributes<HTMLElementType>,
      "value" | "defaultValue" | "size" | "onChange"
    >,
    ControlProps<string> {
  relationEntityId: string;

  ultimateEntity: UltimateEntity;
  ultimateEntityRelation: UltimateEntityRelation;
  ultimateEntityDocument: UltimateEntityModel;
}

const DEFAULT_ONE_TO_MANY_SELECT_CONTROL_PLACEHOLDER = "Select an document.";

const OneToOneRelationSelectControl = ({
  value,
  defaultValue,
  onValueChange,
  relationEntityId,

  ultimateEntity,
  ultimateEntityDocument,
  ultimateEntityRelation,

  ...props
}: OneToOneRelationSelectControlProps) => {
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

  // async function handleCreateEntityAndAssign(document: UltimateEntityModel) {
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

  /**
   * a simple select form to select from the available entities
   */
  // return <div>ONE-TO-ONE CONTROLLER, target-relation:{relationEntityId}</div>;

  return (
    <div>
      <UltimateEntityModalSelect
        ultimateEntityId={relationEntityId}
        disabledDocumentsId={[]}
        hiddenDocumentsIds={[]}
        onSelectCancel={() => null}
        onSelectComplete={handleSelectionChange}
        documentCreationDefaultValues={{
          [ultimateEntityRelation.relationEntityPropertyName]: {
            id: ultimateEntityDocument.id,
          },
        }}
      >
        <div className="w-full h-10 border border-border rounded flex flex-row items-center justify-between p-2">
          {value ? (
            <>
              <Badge>Selected: {value}</Badge>
              <div className="flex flex-row items-center gap-2">
                <Badge className="aspect-square cursor-pointer hover:opacity-75 active:opacity-75">
                  <ChevronUpDown className="scale-80" />
                </Badge>
                <Badge
                  onClick={handleSelectDelete}
                  className="aspect-square cursor-pointer hover:opacity-75 active:opacity-75"
                >
                  <XMark className="scale-80" />
                </Badge>
              </div>
            </>
          ) : (
            <>
              <Badge className="cursor-pointer">Click to select.</Badge>
              <Badge className="aspect-square cursor-pointer hover:opacity-75 active:opacity-75">
                <ChevronUpDown className="scale-80" />
              </Badge>
            </>
          )}
        </div>
      </UltimateEntityModalSelect>
    </div>
  );
};

export default OneToOneRelationSelectControl;
