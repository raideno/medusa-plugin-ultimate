import { UltimateEntityModel } from "../../../types/ultimate-entity-model";
import { UltimateEntityRelation } from "../../../types/ultimate-entity-relation";
import { UltimateEntityRelationTypes } from "../../../types/ultimate-entity-relation-types";

import ManyToManyControl from "./relation-controlers/many-to-many-relation-select-control";
import ManyToOneControl from "./relation-controlers/many-to-one-relation-select-control";
import OneToManyControl from "./relation-controlers/one-to-many-relation-select-control";

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
  switch (relation.type) {
    case UltimateEntityRelationTypes.MANY_TO_MANY_RELATION_SELECT:
      return (
        <ManyToManyControl
          relationEntityId={relation.relationEntityId}
          // TODO: remove the any
          defaultValue={defaultDocument[relation.id]}
          value={document[relation.id]}
          onValueChange={handleValueChange.bind(null, relation.id)}
        />
      );
      break;

    case UltimateEntityRelationTypes.MANY_TO_ONE_RELATION_SELECT:
      return (
        <ManyToOneControl
          relationEntityId={relation.relationEntityId}
          // TODO: remove the any
          defaultValue={defaultDocument[relation.id]}
          value={document[relation.id]}
          onValueChange={handleValueChange.bind(null, relation.id)}
        />
      );
      break;

    case UltimateEntityRelationTypes.ONE_TO_MANY_RELATION_SELECT:
      return (
        <OneToManyControl
          relationEntityId={relation.relationEntityId}
          // TODO: remove the any
          defaultValue={defaultDocument[relation.id]}
          value={document[relation.id]}
          onValueChange={handleValueChange.bind(null, relation.id)}
        />
      );
      break;
    default:
      return <div>input</div>;
      break;
  }
};

export default UltimateEntityRelation;
