import { Badge, Text } from "@medusajs/ui";

import formatTime from "../../../../../utils/format-time";
import formatDate from "../../../../../utils/format-date";

import { useUltimateEntityDocumentPage } from "../../../../../contexts/ultimate-entity-document-page";

import Skeleton from "../../../../../components/layout/skeleton";
import ErrorLayout from "../../../../../components/layout/error-layout";

import UltimateEntityDocumentInfosOrdering from "./ultimate-entity-document-infos-ordering";

const UltimateEntityDocumentInfos = () => {
  const { error, document, entity, isLoading } = useUltimateEntityDocumentPage();

  if (isLoading) return <Skeleton className="mb-xsmall w-full h-20" />;

  if (error || (!entity || entity === undefined || entity === null) || (!document || document === undefined || document === null)) return <ErrorLayout />;

  const creationDateAndTime = {
    date: formatDate(document.created_at),
    time: formatTime(document.created_at),
  };

  const lastUpdateDateAndTime = {
    date: formatDate(document.updated_at),
    time: formatTime(document.updated_at),
  };

  return (
    <div className="mb-xsmall p-4 flex flex-col gap-1 bg-white rounded border border-border">
      <div className="flex flex-row items-center gap-1">
        <Badge>{"ID"}</Badge>
        <Badge>{document.id}</Badge>
      </div>
      <UltimateEntityDocumentInfosOrdering
        entity={entity}
        document={document}
      />
      <div className="flex flex-row items-baseline gap-1">
        <Text className="text-grey-50">{"Created at"}</Text>
        <Text className="text-grey-50">{creationDateAndTime.date}</Text>
      </div>
      <div className="flex flex-row items-baseline gap-1">
        <Text className="text-grey-50">{"Last Updated at"}</Text>
        <Text className="text-grey-50">{lastUpdateDateAndTime.date}</Text>
      </div>
    </div>
  );
};

export default UltimateEntityDocumentInfos;
