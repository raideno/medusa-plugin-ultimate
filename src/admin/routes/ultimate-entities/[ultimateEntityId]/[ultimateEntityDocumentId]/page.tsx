import { useParams } from "react-router-dom";
import { RouteProps } from "@medusajs/admin";

import { UltimateEntityDocumentPageProvider } from "../../../../contexts/ultimate-entity-document-page";

import UltiamteEntityPageGoBackButton from "../../../../components/layout/ultimate-entity-page-go-back-button";

import UltimateEntityDocumentForm from "./components/ultimate-entity-document-form";
import UltimateEntityDocumentHeader from "./components/ultimate-entity-document-header";
import UltimateEntityDocumentControlsBar from "./components/ultimate-entity-document-controls-bar";
import UltimateEntityDocumentInfos from "./components/ultimate-entity-document-infos";
import getPagePathname from "../../../../utils/get-page-pathname";

const UltimateEntityDocumentPage = ({ notify }: RouteProps) => {
  const { ultimateEntityId, ultimateEntityDocumentId } = useParams();

  return (
    <UltimateEntityDocumentPageProvider
      ultimateEntityId={ultimateEntityId}
      ultimateEntityDocumentId={ultimateEntityDocumentId}
    >
      <div className="relative">
        <UltiamteEntityPageGoBackButton
          children={"Go back."}
          href={getPagePathname.entityDocuments(ultimateEntityId)}
        />

        <UltimateEntityDocumentHeader />

        <UltimateEntityDocumentInfos />

        <UltimateEntityDocumentForm />

        <UltimateEntityDocumentControlsBar />

        <div className="h-20 w-full" />
      </div>
    </UltimateEntityDocumentPageProvider>
  );
};

export default UltimateEntityDocumentPage;
