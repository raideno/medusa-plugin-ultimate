import { Drawer } from "@medusajs/ui";

import useUltimateEntityDocuments from "../../hooks/ultimate-entities-documents/use-ultimate-entity-documents";

import ErrorLayout from "../layout/error-layout";
import UltimateEntityDocumentCard, {
  UltimateEntityDocumentEditPages,
} from "../ultimate-entity-document-card/ultimate-entity-document-card";

interface UltimateEntityDocumentsDrawerSelectProps {
  children: React.ReactNode;

  state: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;

  ultimateEntityId: string;

  disabledDocumentsIds: string[];

  onSelect: (documentId: string | undefined | null) => void;
}

const UltimateEntityDocumentsDrawerSelect = ({
  close,
  open,
  toggle,
  state,
  children: trigger,
  ultimateEntityId,
  onSelect,
}: UltimateEntityDocumentsDrawerSelectProps) => {
  const { data, isLoading, error } =
    useUltimateEntityDocuments(ultimateEntityId);

  function handleDrawerSelect(documentId: string) {
    onSelect(documentId);
  }

  function handleDrawerOpenChange(isOpen: boolean) {
    if (isOpen) open();
    else close();
  }

  if (isLoading)
    return (
      <div>
        <div>Loading</div>
      </div>
    );

  if (error) return <ErrorLayout />;

  const documents = data.documents;

  return (
    <Drawer open={state} onOpenChange={handleDrawerOpenChange}>
      <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Select a Document</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          {documents.map((document) => {
            return (
              <UltimateEntityDocumentCard
                onClick={handleDrawerSelect.bind(null, document.id)}
                document={document}
                entity={{ id: ultimateEntityId }}
                // TODO: fix this
                editPage={UltimateEntityDocumentEditPages.DRAWER}
              />
            );
          })}
        </Drawer.Body>
        <Drawer.Footer></Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  );
};
