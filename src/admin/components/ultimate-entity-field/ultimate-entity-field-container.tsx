import { Text } from "@medusajs/ui";

import { UltimateEntityModel } from "../../../types/ultimate-entity-model";

import UltimateEntityField from "./ultimate-entity-field";

interface UltimateEntityFieldContainerProps {
  field: UltimateEntityField;
  document: UltimateEntityModel;
  defaultDocument?: UltimateEntityModel;
  handleValueChange: (key: string, value: any) => void;
}

const UltimateEntityFieldContainer = ({
  document,
  handleValueChange,
  defaultDocument,
  field,
}: UltimateEntityFieldContainerProps) => {
  return (
    <div className="w-full p-4 rounded bg-white border border-border">
      <Text className="text-dark" size="large">
        {field.name || field.id}
      </Text>
      <UltimateEntityField
        field={field}
        document={document}
        defaultDocument={defaultDocument}
        handleValueChange={handleValueChange}
      />
      {field.description && (
        <Text className="text-grey-50">{field.description}</Text>
      )}
    </div>
  );
};

export default UltimateEntityFieldContainer;
