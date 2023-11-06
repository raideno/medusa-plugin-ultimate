import { Text } from "@medusajs/ui";
import { UltimateEntity } from "../../../../../types/ultimate-entity";

import ErrorLayout from "../../../../components/layout/error-layout";
import LoadingSkeletonsWrapper from "../../../../components/layout/loading-skeletons-wrapper";
import { useUltimateEntityDocumentsPage } from "../../../../contexts/ultimate-entity-documents-page"
import UltimateEntityDocumentCardSkeleton from "../../../../components/ultimate-entity-document-card/ultimate-entity-document-card-skeleton";

import UltimateEntityDocumentsPageDocumentsList from "./ultimate-entity-documents-page-documents-list";
import UltimateEntityDocumentsPageOrderableDocuments from "./ultimate-entity-documents-page-documents-orderable";

interface UltimateEntityDocumentsPageDocumentsProps {
    entity: UltimateEntity;
}

const UltimateEntityDocumentsPageDocuments = ({
    entity
}: UltimateEntityDocumentsPageDocumentsProps) => {
    const { isLoading, error, documents, filter, sorting } = useUltimateEntityDocumentsPage();

    if (isLoading)
        return (
            <LoadingSkeletonsWrapper
                iterations={12}
                keyPrefix={"ultimate-entity-documents-page-documents-skeleton-"}
            >
                <UltimateEntityDocumentCardSkeleton />
            </LoadingSkeletonsWrapper>
        );

    if (error || !documents || documents === undefined) {
        return <ErrorLayout />;
    }

    if (documents.length === 0)
        return (
            <div className="w-full py-8 flex flex-col items-center justify-center">
                <Text className="font-normal font-sans txt-medium inter-base-regular text-grey-50">
                    You haven't created any document yet :(
                </Text>
            </div>
        );

    if (entity.ordering && entity.ordering.enabled && filter.value.trim() === "")
        return <UltimateEntityDocumentsPageOrderableDocuments entity={entity} documents={documents} />
    else
        return <UltimateEntityDocumentsPageDocumentsList
            entity={entity}
            filter={filter}
            documents={documents}
            sorting={sorting}
        />
}

export default UltimateEntityDocumentsPageDocuments