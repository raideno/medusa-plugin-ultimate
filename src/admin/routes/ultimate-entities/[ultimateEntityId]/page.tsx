import { ArrowLeft } from "@medusajs/icons";
import { Link, useParams } from "react-router-dom";
import { Heading, Text, Button } from "@medusajs/ui";
import { RouteProps } from "@medusajs/admin";
import useUltimateEntityDocuments from "../../../hooks/ultimate-entities-documents/use-ultimate-entity-documents";
import UltimateEntityDocumentCard from "./components/ultimate-entity-document-card";
import UltiamteEntityPageGoBackButton from "../../../components/ultimate-entity-page-go-back-button";
import UltimateEntityPageHeader from "../../../components/ultimate-entity-page-header";
import useUltimateEntity from "../../../hooks/ultimate-entities/use-ultimate-entity";
import { ULTIMATE_ENTITIES_FRONTEND_PATH } from "../../../config-values";
import UltimateEntityDocumentsPageDocuments from "./components/ultimate-entity-documents-page-documents";
import ErrorLayout from "../../../components/error-layout";
import CreateUltimateEntityDocumentButton from "./components/create-ultimate-entity-document-button";
import Skeleton from "../../../components/skeleton";

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

  return (
    <div>
      <UltiamteEntityPageGoBackButton
        children="Go back to ultimate entities."
        href={`${ULTIMATE_ENTITIES_FRONTEND_PATH}`}
      />
      <UltimateEntityPageHeader
        title={`${entity.name || entity.id} Documents`}
        // TODO: make a helper unction that'll automatically get the ultimate entity name and capitalize it
        description={`${entity.name || entity.id} ultimate entity documents.`}
      />
      <div className="mb-xsmall w-full flex flex-row items-center justify-end">
        <CreateUltimateEntityDocumentButton entity={entity} fields={fields} />
      </div>
      <div className="flex flex-col gap-y-xsmall">
        <UltimateEntityDocumentsPageDocuments entity={entity} />
      </div>
      <div className="h-xlarge w-full" />
    </div>
  );
};

export default UltimateEntityDocumentsPage;
