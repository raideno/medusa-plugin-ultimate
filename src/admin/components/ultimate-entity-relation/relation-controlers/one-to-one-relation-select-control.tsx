import { Plus } from "@medusajs/icons";
import { Badge, IconButton, Select, Tooltip } from "@medusajs/ui";

import { UltimateEntityModel } from "../../../../types/ultimate-entity-model";

import useDocumentName from "../../../hooks/use-document-name";
import useUltimateEntity from "../../../hooks/ultimate-entities/use-ultimate-entity";
import useUltimateEntityDocuments from "../../../hooks/ultimate-entities-documents/use-ultimate-entity-documents";
import CreateUltimateEntityDocumentButton from "../../create-ultimate-entity-document-button/create-ultimate-entity-document-button";

import Skeleton from "../../layout/skeleton";
import ErrorLayout from "../../layout/error-layout";

import { ControlProps } from ".";

type HTMLElementType = HTMLSelectElement;

interface OneToOneRelationSelectControlProps
  extends Omit<
      React.InputHTMLAttributes<HTMLElementType>,
      "value" | "defaultValue" | "size" | "onChange"
    >,
    ControlProps<string> {
  relationEntityId: string;
}

const DEFAULT_ONE_TO_MANY_SELECT_CONTROL_PLACEHOLDER = "Select a relation.";

const OneToOneRelationSelectControl = ({
  value,
  defaultValue,
  onValueChange,
  relationEntityId,
  ...props
}: OneToOneRelationSelectControlProps) => {
  const { data, isLoading, error } =
    useUltimateEntityDocuments(relationEntityId);

  const {
    data: entityData,
    error: entityError,
    isLoading: entityIsLoading,
  } = useUltimateEntity(relationEntityId);

  function handleValueChange(value: string) {
    onValueChange(value);
  }

  async function handleCreateEntityAndAssign(document: UltimateEntityModel) {
    // push the entity into the data array
    // assign the entity id into the value field via the handleValueChange function
  }

  if (isLoading) return <Skeleton className="w-full h-10" />;

  if (error) return <ErrorLayout />;

  if (entityIsLoading) return <Skeleton className="w-full h-10" />;

  if (entityError) return <ErrorLayout />;

  const documents = data.documents;
  const { entity, fields } = entityData.entity;

  return <div>ONE-TO-ONE CONTROLLER, target-relation:{relationEntityId}</div>;

  return (
    <div>
      <Select
        value={value}
        onValueChange={handleValueChange}
        defaultValue={defaultValue}
      >
        <Select.Trigger
          placeholder={DEFAULT_ONE_TO_MANY_SELECT_CONTROL_PLACEHOLDER}
        >
          <Select.Value
            placeholder={DEFAULT_ONE_TO_MANY_SELECT_CONTROL_PLACEHOLDER}
          />
        </Select.Trigger>
        <Select.Content>
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
      {/* <Tooltip content="Create a new document.">
        <CreateUltimateEntityDocumentButton
          entity={entity}
          fields={fields}
          onCreationCancel={() => undefined}
          onCreationComplete={handleCreateEntityAndAssign}
        >
          <Badge className="hover:opacity-75 active:pacity-50 cursor-pointer">
            <Plus />
          </Badge>
        </CreateUltimateEntityDocumentButton>
      </Tooltip> */}
    </div>
  );
};

export default OneToOneRelationSelectControl;
