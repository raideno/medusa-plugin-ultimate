import { Select } from "@medusajs/ui";
import { ControlProps } from ".";
import ErrorLayout from "../../../../../../components/error-layout";
import Skeleton from "../../../../../../components/skeleton";
import useUltimateEntityDocuments from "../../../../../../hooks/ultimate-entities-documents/use-ultimate-entity-documents";

type HTMLElementType = HTMLSelectElement;

interface OneToManyRelationSelectControlProps
  extends Omit<
      React.InputHTMLAttributes<HTMLElementType>,
      "value" | "defaultValue" | "size" | "onChange"
    >,
    ControlProps<string> {
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
  const { data, isLoading, error } =
    useUltimateEntityDocuments(relationEntityId);

  function handleValueChange(value: string) {
    onValueChange(value);
  }

  if (isLoading) return <Skeleton className="w-full h-10" />;

  if (error) return <ErrorLayout />;

  const documents = data.documents;

  return (
    <Select
      value={value}
      onValueChange={handleValueChange}
      defaultValue={defaultValue}
    >
      <Select.Trigger>
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
              {document.id}
            </Select.Item>
          );
        })}
      </Select.Content>
    </Select>
  );
};

export default OneToManyRelationSelectControl;
