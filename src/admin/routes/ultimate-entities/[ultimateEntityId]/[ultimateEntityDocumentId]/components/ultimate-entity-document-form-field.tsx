import { Badge, Text } from "@medusajs/ui";
import { UltimateEntityField } from "../../../../../../types/ultimate-entity-field";
import UltimateEntityFormFieldControl from "./ultimate-entity-document-form-field-control";
import { useUltimateEntityDocumentPage } from "../../../../../contexts/ultimate-entity-document-page";
import ErrorLayout from "../../../../../components/error-layout";
import { UltimateEntityModel } from "../../../../../../types/ultimate-entity-model";

interface UltimateEntityFormFieldProps {
  field: UltimateEntityField;
  document: UltimateEntityModel;
  defaultDocument?: UltimateEntityModel;
  handleValueChange: (key: string, value: any) => void;
}

const UltimateEntityFormField = ({
  document,
  handleValueChange,
  defaultDocument,
  field,
}: UltimateEntityFormFieldProps) => {
  return (
    <div className="w-full p-4 rounded bg-white border border-border">
      <Text className="text-dark" size="large">
        {field.name || field.id}
      </Text>
      <UltimateEntityFormFieldControl
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

export default UltimateEntityFormField;
