import { orderBy } from "lodash";

import { UltimateEntity } from "../../../../../types/ultimate-entity";

import ErrorLayout from "../../../../components/layout/error-layout";
import LoadingSkeletonsWrapper from "../../../../components/layout/loading-skeletons-wrapper";
import UltimateEntityDocumentCardSkeleton from "../../../../components/ultimate-entity-document-card/ultimate-entity-document-card-skeleton";
import UltimateEntityDocumentCard, {
  UltimateEntityDocumentEditPages,
} from "../../../../components/ultimate-entity-document-card/ultimate-entity-document-card";

import useUltimateEntityDocuments from "../../../../hooks/ultimate-entities-documents/use-ultimate-entity-documents";
import { Text } from "@medusajs/ui";

interface UltimateEntityDocumentsPageDocumentsProps {
  entity: UltimateEntity;
  filter?: { key: string; value?: string | undefined };
  sorting: {
    field: string;
    direction: "asc" | "desc";
  };
}

const UltimateEntityDocumentsPageDocuments = ({
  entity,
  filter,
  sorting,
}: UltimateEntityDocumentsPageDocumentsProps) => {
  const { data, isLoading, error } = useUltimateEntityDocuments(entity.id);

  if (isLoading)
    return (
      <LoadingSkeletonsWrapper
        iterations={12}
        keyPrefix={"ultimate-entity-documents-page-documents-skeleton-"}
      >
        <UltimateEntityDocumentCardSkeleton />
      </LoadingSkeletonsWrapper>
    );

  if (error || !data || data === undefined) {
    return <ErrorLayout />;
  }

  const documents = data.documents;

  // blogPost_01HCMRCEVBQ6HKBYZJKGQRSPSF

  const filteredDocuments = documents.filter((document) => {
    if (!filter || !filter.value || filter.value.trim() === "") return true;
    else
      return (document[filter.key] as string)
        .toLocaleLowerCase()
        .includes(filter.value.toLocaleLowerCase());
  });

  if (filteredDocuments.length === 0)
    return (
      <div className="w-full py-8 flex flex-col items-center justify-center">
        <Text className="font-normal font-sans txt-medium inter-base-regular text-grey-50">
          No document match for filter :(
        </Text>
      </div>
    );

  return (
    <>
      {orderBy(filteredDocuments, [sorting.field], [sorting.direction]).map(
        (document) => {
          return (
            <UltimateEntityDocumentCard
              entity={entity}
              document={document}
              key={entity.id + "-" + document.id}
              editPage={UltimateEntityDocumentEditPages.EXTERNAL}
            />
          );
        }
      )}
    </>
  );
};

export default UltimateEntityDocumentsPageDocuments;
