import {
  Button,
  FocusModal,
  Heading,
  Input,
  Label,
  Text,
  useToggleState,
} from "@medusajs/ui";

import { UltimateEntityDocument } from "../../../types/ultimate-entity-document";

import useUltimateEntity from "../../hooks/ultimate-entities/use-ultimate-entity";
import useUltimateEntityDocuments from "../../hooks/ultimate-entities-documents/use-ultimate-entity-documents";

import UltimateEntityDocumentCard, {
  UltimateEntityDocumentEditPages,
} from "../ultimate-entity-document-card/ultimate-entity-document-card";
import CreateUltimateEntityDocumentButton from "../create-ultimate-entity-document-button/create-ultimate-entity-document-button";

interface UltimateEntityModalSelectProps {
  children: React.ReactNode;
  onSelectComplete?: (document: UltimateEntityDocument) => void;
  onSelectCancel?: () => void;
  ultimateEntityId: string;
  // show but not allowed to click them
  disabledDocumentsId?: string[];
  // don't show at all (usually used to say that documents are already selected)
  hiddenDocumentsIds?: string[];
  // tooltip content to show when hovering over a disabled document
  tooltipContent?: ({
    document,
  }: {
    document: UltimateEntityDocument;
  }) => string | React.ReactNode;
}

const UltimateEntityModalSelect = ({
  children: trigger,
  ultimateEntityId,
  disabledDocumentsId = [],
  hiddenDocumentsIds = [],
  onSelectCancel,
  onSelectComplete,
  tooltipContent,
}: UltimateEntityModalSelectProps) => {
  const ultimateEntityDocumentsResponse =
    useUltimateEntityDocuments(ultimateEntityId);

  const ultimateEntityResponse = useUltimateEntity(ultimateEntityId);

  const {
    state: isModalOpen,
    close: closeModal,
    open: openModal,
    toggle: toggleModal,
  } = useToggleState();

  function handleCancelSelection() {
    onSelectCancel();
    closeModal();
  }

  function handleDocumentSelected(document: UltimateEntityDocument) {
    onSelectComplete(document);
    closeModal();
  }

  async function handleDocumentCreationComplete(
    document: UltimateEntityDocument
  ) {
    onSelectComplete(document);
    closeModal();
  }

  async function handleDocumentCreationCancel() {}

  function handleModalOpenChange(isOpen: boolean) {
    if (isOpen) openModal();
    else closeModal();
  }

  if (
    ultimateEntityDocumentsResponse.isLoading ||
    ultimateEntityResponse.isLoading
  )
    return (
      <div>
        <div>Loading</div>
      </div>
    );

  if (
    ultimateEntityDocumentsResponse.error ||
    !ultimateEntityDocumentsResponse.data ||
    ultimateEntityResponse.error ||
    !ultimateEntityResponse.data
  )
    return (
      <div>
        <div>Error</div>
      </div>
    );

  const { entity, fields, relations } = ultimateEntityResponse.data.entity;
  const documents = ultimateEntityDocumentsResponse.data.documents;

  return (
    <FocusModal open={isModalOpen} onOpenChange={handleModalOpenChange}>
      <FocusModal.Trigger asChild>{trigger}</FocusModal.Trigger>
      <FocusModal.Content className="z-[199]">
        <FocusModal.Header>
          <Button variant="secondary" onClick={handleCancelSelection}>
            Cancel
          </Button>
        </FocusModal.Header>
        <FocusModal.Body className="flex flex-col items-center py-16 h-full overflow-y-auto">
          <div className="h-full overflow-y-auto flex w-full max-w-lg flex-col gap-y-8">
            <div className="flex flex-col gap-y-1">
              <Heading>Select a document of type {ultimateEntityId}</Heading>
              <Text className="text-ui-fg-subtle">
                Select from the documents of type {ultimateEntityId} listed
                below or create a new one and select it.
              </Text>
            </div>
            {/* --- */}
            <div className="flex flex-col gap-y-2 p-2 rounded border border-border">
              <CreateUltimateEntityDocumentButton
                fields={fields}
                entity={entity}
                relations={relations}
                onCreationCancel={handleDocumentCreationCancel}
                onCreationComplete={handleDocumentCreationComplete}
              >
                <Button variant="primary" className="w-full">
                  Create a document of type {ultimateEntityId}
                </Button>
              </CreateUltimateEntityDocumentButton>
              <Label htmlFor="key_name" className="text-ui-fg-subtle">
                After creating it'll automatically be selected.
              </Label>
            </div>
            {/*  */}
            {/* TODO: add a search-bar (search by id | name | title | description | select field to search by) */}
            <div className="h-full flex flex-col gap-2">
              {documents
                .filter((document) => !hiddenDocumentsIds.includes(document.id))
                .map((document) => {
                  return (
                    <UltimateEntityDocumentCard
                      entity={entity}
                      document={document}
                      editPage={UltimateEntityDocumentEditPages.DRAWER}
                      onClick={
                        !disabledDocumentsId.includes(document.id) &&
                        handleDocumentSelected.bind(null, document)
                      }
                      key={"ultimate-entity-modal-select-item-" + document.id}
                      className={
                        disabledDocumentsId.includes(document.id) &&
                        "cursor-not-allowed	opacity-75"
                      }
                    />
                  );
                })}
            </div>
          </div>
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  );
};

export default UltimateEntityModalSelect;
