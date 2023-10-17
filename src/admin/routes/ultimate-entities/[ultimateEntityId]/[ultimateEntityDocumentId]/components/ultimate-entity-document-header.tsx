import { Badge, Heading, Text } from "@medusajs/ui";

import { useUltimateEntityDocumentPage } from "../../../../../contexts/ultimate-entity-document-page";
import Skeleton from "../../../../../components/skeleton";
import ErrorLayout from "../../../../../components/error-layout";
import useEntityName from "../../../../../hooks/use-entity-name";

const UltimateEntityDocumentHeader = () => {
  const { error, isLoading, entity } = useUltimateEntityDocumentPage();

  if (isLoading) return <Skeleton className="w-full h-32" />;

  if (error) return <ErrorLayout />;

  return (
    <div className="mb-xlarge w-full bg-white rounded border border-border p-4">
      <Heading className="inter-2xlarge-semibold mb-xsmall">{`${useEntityName(
        entity
      )} Documents`}</Heading>
      <Text className="inter-base-regular text-grey-50">{`${useEntityName(
        entity
      )} ultimate entity documents.`}</Text>
    </div>
  );
};

export default UltimateEntityDocumentHeader;
