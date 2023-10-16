import { useParams } from "react-router-dom";
import { RouteProps } from "@medusajs/admin";

import { ULTIMATE_ENTITIES_FRONTEND_PATH } from "../../../../config-values";

import { UltimateEntityDocumentPageProvider } from "../../../../contexts/ultimate-entity-document-page";

import UltiamteEntityPageGoBackButton from "../../../../components/ultimate-entity-page-go-back-button";

import UltimateEntityDocumentForm from "./components/ultimate-entity-document-form";
import UltimateEntityDocumentHeader from "./components/ultimate-entity-document-header";
import UltimateEntityDocumentControlsBar from "./components/ultimate-entity-document-controls-bar";
import UltimateEntityDocumentInfos from "./components/ultimate-entity-document-infos";

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
          href={ULTIMATE_ENTITIES_FRONTEND_PATH + "/" + ultimateEntityId}
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
