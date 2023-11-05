import { useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  DotsSix,
  Pencil,
  Spinner,
  SquareTwoStack,
  SquareTwoStackMini,
  Trash,
} from "@medusajs/icons";
import {
  useToast,
  Toast,
  Container,
  Badge,
  IconButton,
  usePrompt,
  clx,
  Tooltip,
} from "@medusajs/ui";

import { UltimateEntity } from "../../../types/ultimate-entity";
import { UltimateEntityDocument } from "../../../types/ultimate-entity-document";

import getPagePathname from "../../utils/get-page-pathname";

import deleteUltimateEntityDocument from "../../functions/ultimate-entities-documents-operations/delete-ultimate-entity-document";
import createUltimateEntityDocument from "../../functions/ultimate-entities-documents-operations/create-ultimate-entity-document";

import useDocumentName from "../../hooks/use-document-name";

import UpdateUltimateEntityDocumentButton from "../update-ultimate-entity-document-button/update-ultimate-entity-document-button";
import {
  useUltimateEntityDocumentsReturnType,
  useUltimateEntityDocumentsKey,
  mutateUltimateEntityDocuments,
} from "../../hooks/ultimate-entities-documents/use-ultimate-entity-documents";
import { mutateUltimateEntityDocument } from "../../hooks/ultimate-entities-documents/use-ultimate-entity-document";

export enum UltimateEntityDocumentEditPages {
  EXTERNAL = "EXTERNAL",
  DRAWER = "DRAWER",
}

interface UltimateEntityDocumentCardProps {
  entity: UltimateEntity;
  document: UltimateEntityDocument;
  editPage: UltimateEntityDocumentEditPages;
  onClick?: () => void;
  className?: string;
  id?: string;
  draggable?: boolean
}

const UltimateEntityDocumentCard = ({
  entity,
  document,
  editPage,
  onClick,
  className,
  draggable,
  id,
}: UltimateEntityDocumentCardProps) => {
  const prompt = usePrompt();
  const navigate = useNavigate();

  const { toast } = useToast();

  const [isBeingEdited, setIsBeingEdited] = useState<boolean>(false);
  const [isBeingDeleted, setIsBeingDeleted] = useState<boolean>(false);
  const [haveBeenDeleted, setHaveBeenDeleted] = useState<boolean>(false);

  const [isBeingDuplicated, setIsBeingDuplicated] = useState<boolean>(false);

  async function handleEditButtonClick() {
    if (isBeingDuplicated || isBeingEdited || isBeingDeleted || haveBeenDeleted)
      return;

    setIsBeingEdited(true);

    const href = getPagePathname.entityDocument(entity.id, document.id);

    navigate(href);

    setIsBeingEdited(false);
  }

  async function handleDuplicateButtonClick() {
    if (isBeingDuplicated || isBeingEdited || isBeingDeleted || haveBeenDeleted)
      return;

    setIsBeingDuplicated(true);

    // const data = JSON.parse(JSON.stringify(document)) as typeof document;

    try {
      const { document: duplicatedDocument } =
        await createUltimateEntityDocument(entity.id, {
          ...document,
          id: undefined,
          created_at: undefined,
          updated_at: undefined,
        });

      await mutateUltimateEntityDocuments(entity.id, async (oldData) => {
        oldData.documents.push(duplicatedDocument);
        oldData.count = oldData.count + 1;
        return oldData;
      });

      await mutateUltimateEntityDocument(
        entity.id,
        duplicatedDocument.id,
        async () => {
          return { document: duplicatedDocument };
        }
      );

      toast({
        variant: "success",
        title: "Document duplicated.",
        description: "You'll be redirected to your document page.",
      });

      navigate(
        getPagePathname.entityDocument(entity.id, duplicatedDocument.id)
      );
    } catch (err: any) {
      toast({
        variant: "error",
        title: "Document duplication failed.",
        description: "Something went wrong, check console and try again.",
      });

      console.error("[duplication-error]:", err);
    } finally {
      setIsBeingDuplicated(false);
    }
  }

  async function handleDeleteButtonClick() {
    if (isBeingEdited || isBeingDeleted || haveBeenDeleted) return;

    setIsBeingDeleted(true);

    const confirmed = await prompt({
      title: "Are you sure ?",
      description: "Please confirm your action.",
    });

    try {
      if (confirmed) {
        await deleteUltimateEntityDocument(entity.id, document.id);
        setHaveBeenDeleted(true);

        await mutateUltimateEntityDocuments(entity.id, async (oldData) => {
          const documentIndex = oldData.documents.findIndex(
            (d) => d.id === document.id
          );
          oldData.documents.splice(documentIndex, 1);
          oldData.count = oldData.count - 1;
          return oldData;
        });
      }
    } catch (error) {
      toast({
        variant: "error",
        title: "Failed to delete document.",
        description: "Something went wrong, check console and try again.",
      });
      setHaveBeenDeleted(false);
    } finally {
      setIsBeingDeleted(false);
    }
  }

  if (haveBeenDeleted) return null;

  return (
    <Container id={id} onClick={onClick} className={clx(className)}>
      <div className="w-full flex flex-row items-center justify-between">
        <div className="flex flex-row items-center justify-center gap-2">
          {draggable && <DotsSix className="cursor-grab	active:cursor-grabbing" />}
          <Badge>{useDocumentName(document)}</Badge>
        </div>
        {!entity.isBuiltInEntity ? (
          <div className="flex flex-row items-center gap-2">
            {(() => {
              switch (editPage) {
                case UltimateEntityDocumentEditPages.DRAWER:
                  return (
                    <Tooltip content="Update document.">
                      <UpdateUltimateEntityDocumentButton
                        documentId={document.id}
                        ultimateEntityId={entity.id}
                        onUpdateCancel={() => null}
                        onUpdateComplete={() => null}
                      >
                        <IconButton
                          disabled={haveBeenDeleted || isBeingDeleted}
                          variant="transparent"
                        >
                          <Pencil />
                        </IconButton>
                      </UpdateUltimateEntityDocumentButton>
                    </Tooltip>
                  );
                  break;
                default:
                case UltimateEntityDocumentEditPages.EXTERNAL:
                  return (
                    <Tooltip content="Update document.">
                      <IconButton
                        onClick={handleEditButtonClick}
                        disabled={haveBeenDeleted || isBeingDeleted}
                        isLoading={isBeingEdited}
                        variant="transparent"
                      >
                        <Pencil />
                      </IconButton>
                    </Tooltip>
                  );
                  break;
              }
            })()}
            <Tooltip content="Duplicate document.">
              <IconButton
                onClick={handleDuplicateButtonClick}
                disabled={haveBeenDeleted || isBeingDeleted}
                isLoading={isBeingDuplicated}
                variant="transparent"
              >
                <SquareTwoStack />
              </IconButton>
            </Tooltip>
            <Tooltip content="Delete document.">
              <IconButton
                onClick={handleDeleteButtonClick}
                disabled={haveBeenDeleted || isBeingEdited}
                isLoading={isBeingDeleted}
                variant="transparent"
              >
                <Trash />
              </IconButton>
            </Tooltip>
          </div>
        ) : (
          <div />
        )}
      </div>
    </Container>
  );
};

export default UltimateEntityDocumentCard;
