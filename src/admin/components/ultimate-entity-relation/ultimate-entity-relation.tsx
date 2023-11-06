import { UltimateEntity } from "../../../types/ultimate-entity";
import { UltimateEntityDocument } from "../../../types/ultimate-entity-document";
import { UltimateEntityRelation } from "../../../types/ultimate-entity-relation";
import { UltimateEntityRelationTypes } from "../../../types/ultimate-entity-relation-types";

import OneToOneyControl from "./relation-controlers/one-to-one-relation-select-control";
import ManyToOneControl from "./relation-controlers/many-to-one-relation-select-control";
import OneToManyControl from "./relation-controlers/one-to-many-relation-select-control";

interface UltimateEntityRelationProps {
  entity: UltimateEntity;
  relation: UltimateEntityRelation;
  document: UltimateEntityDocument;
  defaultDocument: UltimateEntityDocument;
  /*---*/
  handleValueChange: (key: string, value: any) => void;
}

// TODO: fix this
const getValue = (relation: any) => {
  if (!relation || relation === undefined || relation === null)
    return undefined;

  if (typeof relation === "string") return relation;

  if (
    Array.isArray(relation) &&
    relation.length > 0 &&
    typeof relation[0] === "string"
  )
    return relation;

  if (Array.isArray(relation)) return relation.map((relation) => relation.id);

  if (typeof relation === "object") return relation.id;

  return relation.id;
};

const UltimateEntityRelation = ({
  entity,
  relation,
  document,
  defaultDocument,
  /*---*/
  handleValueChange,
}: UltimateEntityRelationProps) => {
  // TODO: for the value / default value, give the ids, don't pass the whole object

  const defaultValue = getValue(defaultDocument[relation.id]);
  const value = getValue(document[relation.id]);

  function onValueChange(newValue: string | string[]) {
    if (!newValue || newValue === null) {
      handleValueChange(relation.id, newValue);
    } else if (Array.isArray(newValue)) {
      handleValueChange(
        relation.id,
        newValue.map((id) => ({ id }))
      );
    } else {
      handleValueChange(relation.id, {
        id: newValue,
      });
    }
  }

  switch (relation.type) {
    case UltimateEntityRelationTypes.ONE_TO_ONE_RELATION_SELECT:
      return (
        <OneToOneyControl
          ultimateEntity={entity}
          ultimateEntityDocument={document}
          ultimateEntityRelation={relation}
          // ----
          relationEntityId={relation.relationEntityId}
          // TODO: remove the any
          defaultValue={defaultValue}
          value={value}
          onValueChange={onValueChange}
        />
      );
      break;

    // case UltimateEntityRelationTypes.MANY_TO_MANY_RELATION_SELECT:
    //   return (
    //     <ManyToManyControl
    //       relationEntityId={relation.relationEntityId}
    //       // TODO: remove the any
    //       defaultValue={defaultValue || []}
    //       value={value || []}
    //       onValueChange={onValueChange}
    //     />
    //   );
    //   break;

    case UltimateEntityRelationTypes.MANY_TO_ONE_RELATION_SELECT:
      return (
        <ManyToOneControl
          ultimateEntity={entity}
          ultimateEntityDocument={document}
          ultimateEntityRelation={relation}
          // ----
          relationEntityId={relation.relationEntityId}
          // TODO: remove the any
          defaultValue={defaultValue}
          value={value}
          onValueChange={onValueChange}
        />
      );
      break;

    case UltimateEntityRelationTypes.ONE_TO_MANY_RELATION_SELECT:
      return (
        <OneToManyControl
          ultimateEntity={entity}
          ultimateEntityDocument={document}
          ultimateEntityRelation={relation}
          // ----
          relationEntityId={relation.relationEntityId}
          // TODO: remove the any
          defaultValue={defaultValue || []}
          value={value || []}
          onValueChange={onValueChange}
        />
      );
      break;

    case UltimateEntityRelationTypes.UNKNOWN:
    default:
      return <div>invalid-relation-type</div>;
      break;
  }
};

export default UltimateEntityRelation;
