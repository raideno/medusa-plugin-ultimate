import { UltimateEntity } from "../../../../../types/ultimate-entity";
import ErrorLayout from "../../../../components/layout/error-layout";
import LoadingSkeletonsWrapper from "../../../../components/layout/loading-skeletons-wrapper";
import UltimateEntityDocumentCard, {
  UltimateEntityDocumentEditPages,
} from "../../../../components/ultimate-entity-document-card/ultimate-entity-document-card";
import UltimateEntityDocumentCardSkeleton from "../../../../components/ultimate-entity-document-card/ultimate-entity-document-card-skeleton";
import useUltimateEntityDocuments from "../../../../hooks/ultimate-entities-documents/use-ultimate-entity-documents";

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
        <UltimateEntityDocumentCardSkeleton />
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
            editPage={UltimateEntityDocumentEditPages.EXTERNAL}
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
