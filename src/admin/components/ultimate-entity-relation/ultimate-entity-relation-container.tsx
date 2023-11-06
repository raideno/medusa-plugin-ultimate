import { Text } from "@medusajs/ui";

import { UltimateEntityDocument } from "../../../types/ultimate-entity-document";

import UltimateEntityRelation from "./ultimate-entity-relation";
import { UltimateEntity } from "../../../types/ultimate-entity";

interface UltimateEntityRelationContainerProps {
  entity: UltimateEntity;
  relation: UltimateEntityRelation;
  document: UltimateEntityDocument;
  defaultDocument?: UltimateEntityDocument;
  handleValueChange: (key: string, value: any) => void;
}

const UltimateEntityRelationContainer = ({
  document,
  handleValueChange,
  defaultDocument,
  relation,
  entity,
}: UltimateEntityRelationContainerProps) => {
  return (
    <div className="w-full p-4 rounded bg-white border border-border">
      <Text className="text-dark" size="large">
        {relation.name || relation.id}
      </Text>
      <UltimateEntityRelation
        entity={entity}
        relation={relation}
        document={document}
        defaultDocument={defaultDocument}
        handleValueChange={handleValueChange}
      />
      {relation.description && (
        <Text className="text-grey-50">{relation.description}</Text>
      )}
    </div>
  );
};

export default UltimateEntityRelationContainer;
