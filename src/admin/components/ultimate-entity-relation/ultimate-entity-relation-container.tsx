import { Text } from "@medusajs/ui";

import { UltimateEntityModel } from "../../../types/ultimate-entity-model";

import UltimateEntityRelation from "./ultimate-entity-relation";

interface UltimateEntityRelationContainerProps {
  relation: UltimateEntityRelation;
  document: UltimateEntityModel;
  defaultDocument?: UltimateEntityModel;
  handleValueChange: (key: string, value: any) => void;
}

const UltimateEntityRelationContainer = ({
  document,
  handleValueChange,
  defaultDocument,
  relation,
}: UltimateEntityRelationContainerProps) => {
  return (
    <div className="w-full p-4 rounded bg-white border border-border">
      <Text className="text-dark" size="large">
        {relation.name || relation.id}
      </Text>
      <UltimateEntityRelation
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
