import { UltimateEntityDocument } from "../../../types/ultimate-entity-document";
import UltimateEntityDocumentUpdateDrawer from "./ultimate-entity-document-update-drawer";

interface UpdateUltimateEntityDocumentButtonProps {
  children: React.ReactNode;
  documentId: string;
  ultimateEntityId: string;
  onUpdateCancel?: () => void;
  onUpdateComplete?: (updatedDocument: UltimateEntityDocument) => void;
}

const UpdateUltimateEntityDocumentButton = ({
  documentId,
  ultimateEntityId,
  onUpdateCancel,
  onUpdateComplete,
  children: trigger,
}: UpdateUltimateEntityDocumentButtonProps) => {
  return (
    <UltimateEntityDocumentUpdateDrawer
      documentId={documentId}
      ultimateEntityId={ultimateEntityId}
      onUpdateCancel={onUpdateCancel}
      onUpdateComplete={onUpdateComplete}
    >
      {trigger}
    </UltimateEntityDocumentUpdateDrawer>
  );
};

export default UpdateUltimateEntityDocumentButton;
