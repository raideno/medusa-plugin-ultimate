import { FormEvent, useState, useEffect } from "react";

import { Button, Drawer, useToggleState } from "@medusajs/ui";

import ErrorLayout from "../layout/error-layout";

import { UltimateEntityDocument } from "../../../types/ultimate-entity-document";

import useUltimateEntity from "../../hooks/ultimate-entities/use-ultimate-entity";
import useUltimateEntityDocument from "../../hooks/ultimate-entities-documents/use-ultimate-entity-document";
import UltimateEntityFieldContainer from "../ultimate-entity-field/ultimate-entity-field-container";
import UltimateEntityRelationContainer from "../ultimate-entity-relation/ultimate-entity-relation-container";
import updateUltimateEntityDocument from "../../functions/ultimate-entities-documents-operations/update-ultimate-entity-document";

const EXCLUDED_FIELDS_IDS = ["id", "created_at", "updated_at"];

interface UltimateEntityDocumentUpdateDrawerProps {
  children: React.ReactNode;
  documentId: string;
  ultimateEntityId: string;
  onUpdateCancel?: () => void;
  onUpdateComplete?: (updatedDocument: UltimateEntityDocument) => void;
}

const UltimateEntityDocumentUpdateDrawer = ({
  children: trigger,
  documentId,
  ultimateEntityId,
  onUpdateCancel,
  onUpdateComplete,
}: UltimateEntityDocumentUpdateDrawerProps) => {
  const ultimateEntityResponse = useUltimateEntity(ultimateEntityId);
  const ultimateEntityDocumentResponse = useUltimateEntityDocument(
    ultimateEntityId,
    documentId
  );

  const {
    state: isDrawerOpen,
    open: openDrawer,
    close: closeDrawer,
    toggle: toggleDrawer,
  } = useToggleState();

  const [document, setDocument] = useState<
    UltimateEntityDocument | null | undefined
  >(undefined);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [isCancelationLoading, setIsCancelationLoading] =
    useState<boolean>(false);

  useEffect(() => {
    console.log("USE EFFECT STAGE 0");
    if (!ultimateEntityDocumentResponse.isLoading) {
      console.log("USE EFFECT STAGE 1");

      if (
        !ultimateEntityDocumentResponse.error &&
        ultimateEntityDocumentResponse.data
      ) {
        console.log("USE EFFECT STAGE 2");

        {
          console.log("USE EFFECT FINAL STAGE");

          setDocument(ultimateEntityDocumentResponse.data.document);
        }
      }
    }
  }, [
    ultimateEntityDocumentResponse.isLoading,
    ultimateEntityDocumentResponse.data,
  ]);

  async function handleCancelButtonClick() {
    await handleCancel();
  }
  async function handleUpdateButtonClick() {
    await handleSubmit();
  }

  async function handleSubmit(event?: FormEvent<HTMLFormElement>) {
    console.log("SUBMITING");

    if (event) event.preventDefault();

    if (isSubmitLoading || isCancelationLoading) return;

    setIsSubmitLoading(true);
    try {
      const { document: updatedDocument } = await updateUltimateEntityDocument(
        ultimateEntityId,
        documentId,
        {
          ...document,
          id: undefined,
          created_at: undefined,
          updated_at: undefined,
        }
      );

      ultimateEntityDocumentResponse.mutate({ document: updatedDocument });

      if (onUpdateComplete) onUpdateComplete(updatedDocument);

      closeDrawer();
    } catch (error) {
    } finally {
      setIsSubmitLoading(false);
    }
  }

  async function handleCancel() {
    if (isSubmitLoading || isCancelationLoading) return;

    console.log("CANCELING");

    setIsCancelationLoading(true);
    try {
      setDocument(ultimateEntityDocumentResponse.data.document);
      if (onUpdateCancel) onUpdateCancel();
      closeDrawer();
    } catch (error) {
    } finally {
      setIsCancelationLoading(true);
    }
  }

  async function handleValueChange(key: string, value: any) {
    const newDocument = JSON.parse(JSON.stringify(document)) as typeof document;
    newDocument[key] = value;
    console.log("CHANGING-VALUE");
    setDocument(newDocument);
  }

  function handleDrawerOpenChange(isOpen: boolean) {
    if (isSubmitLoading || isCancelationLoading) return;

    if (isOpen) openDrawer();
    else closeDrawer();
  }

  if (
    ultimateEntityResponse.isLoading ||
    ultimateEntityDocumentResponse.isLoading
  )
    return <div>Loading</div>;

  if (
    !ultimateEntityResponse.data ||
    ultimateEntityResponse.error ||
    !ultimateEntityDocumentResponse.data ||
    ultimateEntityDocumentResponse.error
  )
    return <ErrorLayout />;

  const { entity, fields, relations } = ultimateEntityResponse.data.entity;
  const documentData = ultimateEntityDocumentResponse.data.document;

  return (
    <Drawer open={isDrawerOpen} onOpenChange={handleDrawerOpenChange}>
      <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>
      <Drawer.Content className="z-[99]">
        <Drawer.Header>
          <Drawer.Title>Update Document</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body className="h-full max-h-full overflow-y-auto">
          <form
            onSubmit={handleSubmit}
            className="h-full max-h-full overflow-y-auto w-full flex flex-col gap-2"
          >
            {fields
              .filter((field) => !EXCLUDED_FIELDS_IDS.includes(field.id))
              .map((field) => {
                return (
                  <UltimateEntityFieldContainer
                    field={field}
                    document={document}
                    handleValueChange={handleValueChange}
                    key={field.id}
                    defaultDocument={documentData}
                  />
                );
              })}
            {relations.map((relation) => {
              return (
                <UltimateEntityRelationContainer
                  key={relation.id}
                  relation={relation}
                  document={document}
                  handleValueChange={handleValueChange}
                  defaultDocument={documentData}
                />
              );
            })}
          </form>
        </Drawer.Body>
        <Drawer.Footer>
          <Button
            onClick={handleCancelButtonClick}
            disabled={isSubmitLoading}
            isLoading={isCancelationLoading}
            variant="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateButtonClick}
            disabled={isCancelationLoading}
            isLoading={isSubmitLoading}
            variant="primary"
          >
            Update
          </Button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  );
};

export default UltimateEntityDocumentUpdateDrawer;
