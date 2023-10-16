import { Badge, Text } from "@medusajs/ui";
import { UltimateEntityField } from "../../../../../../types/ultimate-entity-field";
// import { UltimateEntityFieldTypes } from "../../../../../../types/ultimate-entity-field-types";
import BooleanControl from "./ultimate-entity-document-form-field-controls/boolean-control";
import { useUltimateEntityDocumentPage } from "../../../../../contexts/ultimate-entity-document-page";
import StringControl from "./ultimate-entity-document-form-field-controls/string-control";
import TextControl from "./ultimate-entity-document-form-field-controls/text-control";
import SelectControl from "./ultimate-entity-document-form-field-controls/select-control";
import { UltimateEntityModel } from "../../../../../../types/ultimate-entity-model";
import ImageControl from "./ultimate-entity-document-form-field-controls/image-control";
import OneToManyRelationSelectControl from "./ultimate-entity-document-form-field-controls/one-to-many-relation-select-control";
import StringArrayControl from "./ultimate-entity-document-form-field-controls/string-array-control";
// import { UltimateEntityFieldTypes } from "../../../../../../types/ultimate-entity-field-types";

export enum UltimateEntityFieldTypes {
  STRING = "STRING",
  TEXT = "TEXT",
  BOOLEAN = "BOOLEAN",
  IMAGE = "IMAGE",
  SELECT = "SELECT",
  // ONE_TO_MANY_RELATION_SELECT = "ONE_TO_MANY_RELATION_SELECT",
  UNKNOWN = "UNKNOWN",
  STRING_ARRAY = "STRING_ARRAY",
  //
  // STRING_ARRAY = "STRING_ARRAY",
  // DATE = "DATE",
  // COLOR_PICKER = "COLOR_PICKER",
  // TIME = "TIME",
  // DATE_AND_TIME = "DATE_AND_TIME",
}

interface UltimateEntityFormFieldControlProps {
  field: UltimateEntityField;
  document: UltimateEntityModel;
  handleValueChange: (key: string, value: any) => void;
  defaultDocument?: UltimateEntityModel;
}

const UltimateEntityFormFieldControl = ({
  defaultDocument,
  document,
  handleValueChange,
  field,
}: UltimateEntityFormFieldControlProps) => {
  switch (field.type) {
    case UltimateEntityFieldTypes.BOOLEAN:
      return (
        <BooleanControl
          // TODO: remove the any
          varaint={field.variant as any}
          defaultValue={defaultDocument[field.id]}
          value={document[field.id]}
          onValueChange={handleValueChange.bind(null, field.id)}
        />
      );
      break;
    case UltimateEntityFieldTypes.STRING:
      return (
        <StringControl
          // varaint={field.variant}
          defaultValue={defaultDocument[field.id]}
          value={document[field.id]}
          onValueChange={handleValueChange.bind(null, field.id)}
        />
      );
      break;
    case UltimateEntityFieldTypes.TEXT:
      return (
        <TextControl
          // varaint={field.variant}
          defaultValue={defaultDocument[field.id]}
          value={document[field.id]}
          onValueChange={handleValueChange.bind(null, field.id)}
        />
      );
      break;
    case UltimateEntityFieldTypes.SELECT:
      return (
        <SelectControl
          options={field.options || []}
          // varaint={field.variant}
          defaultValue={defaultDocument[field.id]}
          value={document[field.id]}
          onValueChange={handleValueChange.bind(null, field.id)}
        />
      );
      break;

    case UltimateEntityFieldTypes.STRING_ARRAY:
      return (
        <StringArrayControl
          defaultValue={defaultDocument[field.id]}
          value={document[field.id]}
          onValueChange={handleValueChange.bind(null, field.id)}
        />
      );
      break;
    case UltimateEntityFieldTypes.IMAGE:
      return (
        <ImageControl
          defaultValue={defaultDocument[field.id]}
          value={document[field.id]}
          onValueChange={handleValueChange.bind(null, field.id)}
        />
      );
      break;
    case UltimateEntityFieldTypes.ONE_TO_MANY_RELATION_SELECT:
      return (
        <OneToManyRelationSelectControl
          value={document[field.id]}
          defaultValue={defaultDocument[field.id]}
          onValueChange={handleValueChange.bind(null, field.id)}
        />
      );
      break;

    case UltimateEntityFieldTypes.UNKNOWN:
    default:
      return <div>input</div>;
      break;
  }
};

export default UltimateEntityFormFieldControl;
