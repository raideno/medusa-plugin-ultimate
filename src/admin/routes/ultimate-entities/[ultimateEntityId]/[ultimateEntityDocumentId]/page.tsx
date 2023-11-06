import { Toaster } from "@medusajs/ui";
import { useParams } from "react-router-dom";
import { RouteProps } from "@medusajs/admin";

import { UltimateEntityDocumentPageProvider } from "../../../../contexts/ultimate-entity-document-page";

import getPagePathname from "../../../../utils/get-page-pathname";

import UltiamteEntityPageGoBackButton from "../../../../components/layout/ultimate-entity-page-go-back-button";

import UltimateEntityRawData from "./components/ultimate-entity-raw-data";
import UltimateEntityDocumentForm from "./components/ultimate-entity-document-form";
import UltimateEntityDocumentInfos from "./components/ultimate-entity-document-infos";
import UltimateEntityDocumentHeader from "./components/ultimate-entity-document-header";
import UltimateEntityDocumentControlsBar from "./components/ultimate-entity-document-controls-bar";

const UltimateEntityDocumentPage = ({ notify }: RouteProps) => {
  const { ultimateEntityId, ultimateEntityDocumentId } = useParams();

  return (
    <>
      <UltimateEntityDocumentPageProvider
        ultimateEntityId={ultimateEntityId}
        ultimateEntityDocumentId={ultimateEntityDocumentId}
      >
        <div className="relative">
          <UltiamteEntityPageGoBackButton
            children={"Go back."}
            className="mb-xsmall"
            href={getPagePathname.entityDocuments(ultimateEntityId)}
          />

          <UltimateEntityDocumentHeader />

          <UltimateEntityDocumentInfos />

          <UltimateEntityDocumentForm />

          <UltimateEntityRawData />

          <UltimateEntityDocumentControlsBar />

          <div className="h-20 w-full" />
        </div>
      </UltimateEntityDocumentPageProvider>
      <Toaster />
    </>
  );
};

export default UltimateEntityDocumentPage;
