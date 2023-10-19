import useUltimateEntityDocuments from "../../../../hooks/ultimate-entities-documents/use-ultimate-entity-documents";

import Skeleton from "../../../layout/skeleton";
import ErrorLayout from "../../../layout/error-layout";

import { ControlProps } from "..";

type HTMLElementType = HTMLSelectElement;

interface ManyToManyRelationSelectControlProps
  extends Omit<
      React.InputHTMLAttributes<HTMLElementType>,
      "value" | "defaultValue" | "size" | "onChange"
    >,
    ControlProps<string[]> {
  relationEntityId: string;
}

const DEFAULT_ONE_TO_MANY_SELECT_CONTROL_PLACEHOLDER = "Select a relation.";

const ManyToManyRelationSelectControl = ({
  value,
  defaultValue,
  onValueChange,
  relationEntityId,
  ...props
}: ManyToManyRelationSelectControlProps) => {
  const { data, isLoading, error } =
    useUltimateEntityDocuments(relationEntityId);

  function handleValueChange(value: string[]) {
    onValueChange(value);
  }

  if (isLoading) return <Skeleton className="w-full h-10" />;

  if (error) return <ErrorLayout />;

  const documents = data.documents;

  return <div>MANY-TO-MANY CONTROLLER, target-relation:{relationEntityId}</div>;

  return (
    <div>
      {value.map((v, vI) => {
        return (
          <div key={"many-to-many-relation-" + vI}>selected-document-1</div>
        );
      })}
      <div>-------------------</div>
      <div>
        <div>
          custom select menu, drawer (if document is already selected by another
          one don't show it here or if it's already selected by us + show by
          whom it's selected)
        </div>
        <div>
          create new one------, creation drawer + onCreate return the id and
          assign it
        </div>
      </div>
    </div>
  );
};

export default ManyToManyRelationSelectControl;
