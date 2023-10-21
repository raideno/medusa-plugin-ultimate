import { Badge, Select, Tooltip } from "@medusajs/ui";
import { ControlProps } from ".";

import useUltimateEntityDocuments from "../../../hooks/ultimate-entities-documents/use-ultimate-entity-documents";

import ErrorLayout from "../../layout/error-layout";
import Skeleton from "../../layout/skeleton";
import { UltimateEntityModel } from "../../../../types/ultimate-entity-model";
import CreateUltimateEntityDocumentButton from "../../create-ultimate-entity-document-button/create-ultimate-entity-document-button";
import { ChevronUpDown, Plus, XMark } from "@medusajs/icons";
import useDocumentName from "../../../hooks/use-document-name";
import useUltimateEntity from "../../../hooks/ultimate-entities/use-ultimate-entity";
import UltimateEntityModalSelect from "../../ultimate-entity-documents-modal-select.tsx/ultimate-entity-modal-select";
import { UltimateEntityDocument } from "../../../../types/ultimate-entity-document";

type HTMLElementType = HTMLSelectElement;

interface ManyToOneRelationSelectControlProps
  extends Omit<
      React.InputHTMLAttributes<HTMLElementType>,
      "value" | "defaultValue" | "size" | "onChange"
    >,
    ControlProps<string> {
  relationEntityId: string;
}

const DEFAULT_ONE_TO_MANY_SELECT_CONTROL_PLACEHOLDER = "Select a document.";

const ManyToOneRelationSelectControl = ({
  value,
  defaultValue,
  onValueChange,
  relationEntityId,
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

  return (
    <div>
      <UltimateEntityModalSelect
        ultimateEntityId={relationEntityId}
        disabledDocumentsId={[]}
        hiddenDocumentsIds={[]}
        onSelectCancel={() => null}
        onSelectComplete={handleSelectionChange}
      >
        <div className="w-full h-10 border border-border rounded flex flex-row items-center justify-between p-2">
          {value ? (
            <>
              <Badge>Selected: {value}</Badge>
              <div className="flex flex-row items-center gap-2">
                <Badge className="aspect-square cursor-pointer hover:opacity-75 active:opacity-75">
                  <ChevronUpDown width={12} height={12} />
                </Badge>
                <Badge
                  onClick={handleSelectDelete}
                  className="aspect-square cursor-pointer hover:opacity-75 active:opacity-75"
                >
                  <XMark width={12} height={12} />
                </Badge>
              </div>
            </>
          ) : (
            <>
              <Badge className="cursor-pointer">Click to select.</Badge>
              <Badge className="aspect-square cursor-pointer hover:opacity-75 active:opacity-75">
                <ChevronUpDown width={12} height={12} />
              </Badge>
            </>
          )}
        </div>
      </UltimateEntityModalSelect>
    </div>
  );

  // return (
  //   <div className="grid grid-cols-[auto_1fr] items-center gap-2">
  //     <CreateUltimateEntityDocumentButton
  //       entity={entity}
  //       fields={fields}
  //       relations={relations}
  //       onCreationCancel={() => undefined}
  //       onCreationComplete={handleCreateEntityAndAssign}
  //     >
  //       <Tooltip asChild content="Create a new document.">
  //         <Badge className="min-h-[calc(4px*10)] h-[calc(4px*10)] max-h-[calc(4px*10)] min-w-[calc(4px*10)] w-[calc(4px*10)] max-w-[calc(4px*10)] flex flex-col items-center justify-center aspect-square hover:opacity-75 active:pacity-50 cursor-pointer">
  //           <Plus />
  //         </Badge>
  //       </Tooltip>
  //     </CreateUltimateEntityDocumentButton>
  //     <Select
  //       value={value}
  //       onValueChange={handleValueChange}
  //       defaultValue={defaultValue}
  //     >
  //       <Select.Trigger
  //         placeholder={DEFAULT_ONE_TO_MANY_SELECT_CONTROL_PLACEHOLDER}
  //       >
  //         <Select.Value
  //           placeholder={DEFAULT_ONE_TO_MANY_SELECT_CONTROL_PLACEHOLDER}
  //         />
  //       </Select.Trigger>
  //       <Select.Content className="z-[999]">
  //         {documents.map((document, documentIndex) => {
  //           return (
  //             <Select.Item
  //               value={document.id}
  //               key={"select-one-to-many-relation-item-" + documentIndex}
  //             >
  //               {useDocumentName(document)}
  //             </Select.Item>
  //           );
  //         })}
  //       </Select.Content>
  //     </Select>
  //   </div>
  // );
};

export default ManyToOneRelationSelectControl;
