import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { Pencil, Trash } from "@medusajs/icons";
import { Container, Badge, IconButton, usePrompt, clx } from "@medusajs/ui";

import { UltimateEntity } from "../../../types/ultimate-entity";
import { UltimateEntityDocument } from "../../../types/ultimate-entity-document";

import useDocumentName from "../../hooks/use-document-name";

import deleteUltimateEntityDocument from "../../functions/ultimate-entities-documents-operations/delete-ultimate-entity-document";
import getPagePathname from "../../utils/get-page-pathname";

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
}

const UltimateEntityDocumentCard = ({
  entity,
  document,
  editPage,
  onClick,
  className,
}: UltimateEntityDocumentCardProps) => {
  const prompt = usePrompt();
  const navigate = useNavigate();

  const [isBeingEdited, setIsBeingEdited] = useState<boolean>(false);
  const [isBeingDeleted, setIsBeingDeleted] = useState<boolean>(false);
  const [haveBeenDeleted, setHaveBeenDeleted] = useState<boolean>(false);

  async function handleEditButtonClick() {
    if (isBeingEdited || isBeingDeleted || haveBeenDeleted) return;

    setIsBeingEdited(true);

    const href = getPagePathname.entityDocument(entity.id, document.id);

    navigate(href);

    setIsBeingEdited(false);
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
      }
    } catch (error) {
      setHaveBeenDeleted(false);
    } finally {
      setIsBeingDeleted(false);
    }
  }

  if (haveBeenDeleted) return null;

  return (
    <Container onClick={onClick} className={clx(className)}>
      <div className="w-full flex flex-row items-center justify-between">
        <Badge>{useDocumentName(document)}</Badge>
        <div className="flex flex-row items-center gap-2">
          <IconButton
            onClick={handleEditButtonClick}
            disabled={haveBeenDeleted || isBeingDeleted}
            isLoading={isBeingEdited}
            variant="transparent"
          >
            <Pencil />
          </IconButton>
          <IconButton
            onClick={handleDeleteButtonClick}
            disabled={haveBeenDeleted || isBeingEdited}
            isLoading={isBeingDeleted}
            variant="transparent"
          >
            {/* TODO: replace with a spinner when is being deleted */}
            <Trash />
          </IconButton>
        </div>
      </div>
    </Container>
  );
};

export default UltimateEntityDocumentCard;
