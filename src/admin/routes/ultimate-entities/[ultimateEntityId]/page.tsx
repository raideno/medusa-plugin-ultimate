import { useParams } from "react-router-dom";

import { RouteProps } from "@medusajs/admin";
import { Button } from "@medusajs/ui";

import useEntityName from "../../../hooks/use-entity-name";
import useUltimateEntity from "../../../hooks/ultimate-entities/use-ultimate-entity";

import ErrorLayout from "../../../components/layout/error-layout";
import Skeleton from "../../../components/layout/skeleton";
import UltimateEntityPageHeader from "../../../components/layout/ultimate-entity-page-header";
import UltiamteEntityPageGoBackButton from "../../../components/layout/ultimate-entity-page-go-back-button";
import UltimateEntityDocumentsPageDocuments from "./components/ultimate-entity-documents-page-documents";
import CreateUltimateEntityDocumentButton from "../../../components/create-ultimate-entity-document-button/create-ultimate-entity-document-button";
import getPagePathname from "../../../utils/get-page-pathname";

const UltimateEntityDocumentsPage = ({ notify }: RouteProps) => {
  const { ultimateEntityId } = useParams();

  const {
    data: ultimateEntityData,
    isLoading: isUltimateEntityDataLoading,
    error: isUltimateEntityDataError,
  } = useUltimateEntity(ultimateEntityId);

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
    <div>
      <UltiamteEntityPageGoBackButton
        children="Go back to ultimate entities."
        href={getPagePathname.entities()}
      />
      <UltimateEntityPageHeader
        title={`${useEntityName(entity)} Documents`}
        // TODO: make a helper unction that'll automatically get the ultimate entity name and capitalize it
        description={`${useEntityName(entity)} ultimate entity documents.`}
      />
      <div className="mb-xsmall w-full flex flex-row items-center justify-end">
        <CreateUltimateEntityDocumentButton
          entity={entity}
          fields={fields}
          relations={relations}
        >
          <Button variant="secondary" type="reset">
            Create Document
          </Button>
        </CreateUltimateEntityDocumentButton>
      </div>
      <div className="flex flex-col gap-y-xsmall">
        <UltimateEntityDocumentsPageDocuments entity={entity} />
      </div>
      <div className="h-xlarge w-full" />
    </div>
  );
};

export default UltimateEntityDocumentsPage;
