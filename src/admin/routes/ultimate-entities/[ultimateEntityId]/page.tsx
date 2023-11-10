import { useNavigate, useParams } from "react-router-dom";

import { PlusMini } from "@medusajs/icons";
import { RouteProps } from "@medusajs/admin";
import { Toaster, Button } from "@medusajs/ui";

import getPagePathname from "../../../utils/get-page-pathname";

import { UltimateEntityDocument } from "../../../../types/ultimate-entity-document";

import useEntityName from "../../../hooks/use-entity-name";
import useUltimateEntity from "../../../hooks/ultimate-entities/use-ultimate-entity";

import { UltimateEntityDocumentsPageProvider } from "../../../contexts/ultimate-entity-documents-page";

import Skeleton from "../../../components/layout/skeleton";
import ErrorLayout from "../../../components/layout/error-layout";
import UltimateEntityPageHeader from "../../../components/layout/ultimate-entity-page-header";
import UltimateEntityDocumentsPageFilter from "./components/ultimate-entity-documents-page-filter";
import UltimateEntityDocumentsPageDocuments from "./components/ultimate-entity-documents-page-documents";
import UltiamteEntityPageGoBackButton from "../../../components/layout/ultimate-entity-page-go-back-button";
import UltimateEntityDocumentsPageImportaDataButton from "./components/ultimate-entity-documents-page-importa-data-button";
import UltimateEntityDocumentsPageDownloadDataButton from "./components/ultimate-entity-documents-page-download-data-button";
import CreateUltimateEntityDocumentButton from "../../../components/create-ultimate-entity-document-button/create-ultimate-entity-document-button";
import UltimateEntityDocumentsPagePagination from "./components/ultimate-entity-documents-page-pagination";

const UltimateEntityDocumentsPage = ({ notify }: RouteProps) => {
  const navigate = useNavigate();

  const { ultimateEntityId } = useParams();

  const {
    data: ultimateEntityData,
    isLoading: isUltimateEntityDataLoading,
    error: isUltimateEntityDataError,
  } = useUltimateEntity(ultimateEntityId);

  async function handleDocumentCreationComplete(
    document: UltimateEntityDocument
  ) {
    navigate(getPagePathname.entityDocument(ultimateEntityId, document.id));
  }

  if (isUltimateEntityDataLoading)
    return (
      <div className="w-full">
        <Skeleton className="mb-xsmall w-64 h-8" />
        <Skeleton className="mb-xlarge w-full h-[72px]" />
        <div className="w-full flex flex-col gap-2">
          <div className="w-full flex flex-row items-center justify-end">
            <Skeleton className="mb-xsmall w-64 h-8" />
          </div>
          <Skeleton className="w-full h-[50vh]" />
        </div>
      </div>
    );

  if (isUltimateEntityDataError || !ultimateEntityData) {
    return <ErrorLayout />;
  }

  const entity = ultimateEntityData.entity.entity;
  const fields = ultimateEntityData.entity.fields;
  const relations = ultimateEntityData.entity.relations;

  return (
    <UltimateEntityDocumentsPageProvider
      ultimateEntity={entity}
    >
      <div className="h-full">
        <div className="flex flex-row items-center justify-between mb-xsmall">
          <UltiamteEntityPageGoBackButton
            children="Go back to ultimate entities."
            href={getPagePathname.entities()}
          />

          <div className="flex flex-row items-center gap-2">
            <div className="flex flex-row items-center">
              <UltimateEntityDocumentsPageImportaDataButton />
              <UltimateEntityDocumentsPageDownloadDataButton ultimateEntity={entity} />
            </div>
            {!entity.isBuiltInEntity && (
              <CreateUltimateEntityDocumentButton
                entity={entity}
                fields={fields}
                relations={relations}
                onCreationComplete={handleDocumentCreationComplete}
              >
                <Button variant="secondary" type="reset">
                  <PlusMini />
                  Create Document
                </Button>
              </CreateUltimateEntityDocumentButton>
            )}
          </div>
        </div>

        <UltimateEntityPageHeader
          title={`${useEntityName(entity)} Documents`}
          description={`${useEntityName(entity)} ultimate entity documents.`}
        />

        <UltimateEntityDocumentsPageFilter
          fields={fields}
          relations={relations}
          ultimateEntity={entity}
        />

        <div className="w-full h-full flex flex-col gap-y-xsmall">
          <UltimateEntityDocumentsPageDocuments
            entity={entity}
          />
        </div>

        <UltimateEntityDocumentsPagePagination entity={entity} />

        <div className="h-xlarge w-full" />
      </div>
      <Toaster />
    </UltimateEntityDocumentsPageProvider>
  );
};

export default UltimateEntityDocumentsPage;
