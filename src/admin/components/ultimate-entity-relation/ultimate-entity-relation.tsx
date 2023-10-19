import { UltimateEntityModel } from "../../../types/ultimate-entity-model";
import { UltimateEntityRelation } from "../../../types/ultimate-entity-relation";
import { UltimateEntityRelationTypes } from "../../../types/ultimate-entity-relation-types";

import OneToOneyControl from "./relation-controlers/one-to-one-relation-select-control";
import ManyToOneControl from "./relation-controlers/many-to-one-relation-select-control";
import OneToManyControl from "./relation-controlers/one-to-many-relation-select-control";
import ManyToManyControl from "./relation-controlers/many-to-many-relation-select-control";

interface UltimateEntityRelationProps {
  relation: UltimateEntityRelation;
  document: UltimateEntityModel;
  defaultDocument: UltimateEntityModel;
  /*---*/
  handleValueChange: (key: string, value: any) => void;
}

// TODO: fix this
const getValue = (relation: any) => {
  if (relation === undefined) return undefined;

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
  relation,
  document,
  defaultDocument,
  /*---*/
  handleValueChange,
}: UltimateEntityRelationProps) => {
  // TODO: for the value / default value, give the ids, don't pass the whole object

  const defaultValue = getValue(defaultDocument[relation.id]);
  const value = getValue(document[relation.id]);

  switch (relation.type) {
    case UltimateEntityRelationTypes.ONE_TO_ONE_RELATION_SELECT:
      return (
        <OneToOneyControl
          relationEntityId={relation.relationEntityId}
          // TODO: remove the any
          defaultValue={defaultValue}
          value={value}
          onValueChange={handleValueChange.bind(null, relation.id)}
        />
      );
      break;

    case UltimateEntityRelationTypes.MANY_TO_MANY_RELATION_SELECT:
      return (
        <ManyToManyControl
          relationEntityId={relation.relationEntityId}
          // TODO: remove the any
          defaultValue={defaultValue || []}
          value={value || []}
          onValueChange={handleValueChange.bind(null, relation.id)}
        />
      );
      break;

    case UltimateEntityRelationTypes.MANY_TO_ONE_RELATION_SELECT:
      return (
        <ManyToOneControl
          relationEntityId={relation.relationEntityId}
          // TODO: remove the any
          defaultValue={defaultValue}
          value={value}
          onValueChange={handleValueChange.bind(null, relation.id)}
        />
      );
      break;

    case UltimateEntityRelationTypes.ONE_TO_MANY_RELATION_SELECT:
      return (
        <OneToManyControl
          relationEntityId={relation.relationEntityId}
          // TODO: remove the any
          defaultValue={defaultValue || []}
          value={value || []}
          onValueChange={handleValueChange.bind(null, relation.id)}
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
