import { UltimateEntityField } from "../../../types/ultimate-entity-field";
import { UltimateEntityModel } from "../../../types/ultimate-entity-model";
import { UltimateEntityFieldTypes } from "../../../types/ultimate-entity-field-types";

import TextControl from "./field-controlers/atomic-fields/text-control";
import DateControl from "./field-controlers/atomic-fields/date-control";
import ColorControl from "./field-controlers/atomic-fields/color-control";
import ImageControl from "./field-controlers/atomic-fields/image-control";
import SelectControl from "./field-controlers/atomic-fields/select-control";
import StringControl from "./field-controlers/atomic-fields/string-control";
import BooleanControl from "./field-controlers/atomic-fields/boolean-control";
import MarkdownControl from "./field-controlers/atomic-fields/markdown-control";
import StringArrayControl from "./field-controlers/atomic-fields/string-array-control";

import OneToManyRelationSelectControl from "./field-controlers/relation-fields/one-to-many-relation-select-control";

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
    case UltimateEntityFieldTypes.ONE_TO_MANY_RELATION_SELECT:
      return (
        <OneToManyRelationSelectControl
          relationEntityId={field.relationEntityId}
          value={document[field.id]}
          defaultValue={defaultDocument[field.id]}
          onValueChange={handleValueChange.bind(null, field.id)}
        />
      );
      break;

    case UltimateEntityFieldTypes.MANY_TO_ONE_RELATION_SELECT:
      return (
        <OneToManyRelationSelectControl
          relationEntityId={field.relationEntityId}
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

export default UltimateEntityField;
