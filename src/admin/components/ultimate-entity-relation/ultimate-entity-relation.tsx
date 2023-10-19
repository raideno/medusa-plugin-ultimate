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

const UltimateEntityRelation = ({
  relation,
  document,
  defaultDocument,
  /*---*/
  handleValueChange,
}: UltimateEntityRelationProps) => {
  // TODO: for the value / default value, give the ids, don't pass the whole object
  switch (relation.type) {
    case UltimateEntityRelationTypes.ONE_TO_ONE_RELATION_SELECT:
      return (
        <OneToOneyControl
          relationEntityId={relation.relationEntityId}
          // TODO: remove the any
          defaultValue={
            defaultDocument[relation.id]
              ? defaultDocument[relation.id].id
              : undefined
          }
          value={document[relation.id] ? document[relation.id].id : undefined}
          onValueChange={handleValueChange.bind(null, relation.id)}
        />
      );
      break;

    case UltimateEntityRelationTypes.MANY_TO_MANY_RELATION_SELECT:
      return (
        <ManyToManyControl
          relationEntityId={relation.relationEntityId}
          // TODO: remove the any
          defaultValue={
            defaultDocument[relation.id]
              ? defaultDocument[relation.id].map((doc) => doc.id)
              : undefined
          }
          value={
            document[relation.id]
              ? document[relation.id].map((doc) => doc.id)
              : []
          }
          onValueChange={handleValueChange.bind(null, relation.id)}
        />
      );
      break;

    case UltimateEntityRelationTypes.MANY_TO_ONE_RELATION_SELECT:
      return (
        <ManyToOneControl
          relationEntityId={relation.relationEntityId}
          // TODO: remove the any
          defaultValue={
            defaultDocument[relation.id]
              ? defaultDocument[relation.id].id
              : undefined
          }
          value={document[relation.id] ? document[relation.id].id : undefined}
          onValueChange={handleValueChange.bind(null, relation.id)}
        />
      );
      break;

    case UltimateEntityRelationTypes.ONE_TO_MANY_RELATION_SELECT:
      return (
        <OneToManyControl
          relationEntityId={relation.relationEntityId}
          // TODO: remove the any
          defaultValue={
            defaultDocument[relation.id]
              ? defaultDocument[relation.id].map((doc) => doc.id)
              : undefined
          }
          value={
            document[relation.id]
              ? document[relation.id].map((doc) => doc.id)
              : []
          }
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
