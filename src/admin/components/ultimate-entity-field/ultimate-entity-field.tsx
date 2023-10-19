import { UltimateEntityField } from "../../../types/ultimate-entity-field";
import { UltimateEntityModel } from "../../../types/ultimate-entity-model";
import { UltimateEntityFieldTypes } from "../../../types/ultimate-entity-field-types";

import TextControl from "./field-controlers/text-control";
import DateControl from "./field-controlers/date-control";
import ColorControl from "./field-controlers/color-control";
import ImageControl from "./field-controlers/image-control";
import SelectControl from "./field-controlers/select-control";
import StringControl from "./field-controlers/string-control";
import BooleanControl from "./field-controlers/boolean-control";
import MarkdownControl from "./field-controlers/markdown-control";
import StringArrayControl from "./field-controlers/string-array-control";

interface UltimateEntityFieldProps {
  field: UltimateEntityField;
  document: UltimateEntityModel;
  defaultDocument: UltimateEntityModel;
  /*---*/
  handleValueChange: (key: string, value: any) => void;
}

const UltimateEntityField = ({
  field,
  document,
  defaultDocument,
  /*---*/
  handleValueChange,
}: UltimateEntityFieldProps) => {
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
          placeholder={field.name || field.id}
        />
      );
      break;
    case UltimateEntityFieldTypes.COLOR:
      return (
        <ColorControl
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
          placeholder={field.name || field.id}
        />
      );
      break;
    case UltimateEntityFieldTypes.MARKDOWN:
      return (
        <MarkdownControl
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
          defaultValue={defaultDocument[field.id] || []}
          value={document[field.id]}
          onValueChange={handleValueChange.bind(null, field.id)}
        />
      );
      break;

    case UltimateEntityFieldTypes.STRING_ARRAY:
      return (
        <StringArrayControl
          defaultValue={defaultDocument[field.id] || []}
          value={document[field.id] || []}
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
    case UltimateEntityFieldTypes.DATE:
      return (
        <DateControl
          defaultValue={defaultDocument[field.id]}
          value={document[field.id]}
          onValueChange={handleValueChange.bind(null, field.id)}
        />
      );
      break;

    case UltimateEntityFieldTypes.UNKNOWN:
    default:
      return <div>unknown-field-typr</div>;
      break;
  }
};

export default UltimateEntityField;
