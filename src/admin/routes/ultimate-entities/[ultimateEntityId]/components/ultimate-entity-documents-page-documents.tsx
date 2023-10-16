import { UltimateEntity } from "../../../../../types/ultimate-entity";
import ErrorLayout from "../../../../components/error-layout";
import LoadingSkeletonsWrapper from "../../../../components/loading-skeletons-wrapper";
import useUltimateEntityDocuments from "../../../../hooks/ultimate-entities-documents/use-ultimate-entity-documents";
import useUltimateEntity from "../../../../hooks/ultimate-entities/use-ultimate-entity";
import UltimateEntityDocumentCard from "./ultimate-entity-document-card";
import UltimateEntityDocumentSkeletonCard from "./ultimate-entity-document-skeleton-card";

interface UltimateEntityDocumentsPageDocumentsProps {
  entity: UltimateEntity;
}

const UltimateEntityDocumentsPageDocuments = ({
  entity,
}: UltimateEntityDocumentsPageDocumentsProps) => {
  const { data, isLoading, error } = useUltimateEntityDocuments(entity.id);

  if (isLoading)
    return (
      <LoadingSkeletonsWrapper
        iterations={12}
        keyPrefix={"ultimate-entity-documents-page-documents-skeleton-"}
      >
        <UltimateEntityDocumentSkeletonCard />
      </LoadingSkeletonsWrapper>
    );

  if (error || !data || data === undefined) {
    return <ErrorLayout />;
  }

  const documents = data.documents;

  return (
    <>
      {documents.map((document) => {
        return (
          <UltimateEntityDocumentCard
            entity={entity}
            document={document}
            key={entity.id + "---" + document.id}
          />
        );
      })}
    </>
  );
};

export default UltimateEntityDocumentsPageDocuments;
