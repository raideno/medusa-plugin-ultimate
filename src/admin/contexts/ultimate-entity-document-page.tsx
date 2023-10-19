"use client";

import { usePrompt } from "@medusajs/ui";
import { useNavigate } from "react-router-dom";
import React, { createContext, useEffect, useContext, useState } from "react";

import { UltimateEntity } from "../../types/ultimate-entity";
import { UltimateEntityModel } from "../../types/ultimate-entity-model";
import { UltimateEntityField } from "../../types/ultimate-entity-field";

import { UltimateEntityRelation } from "../../types/ultimate-entity-relation";
import getUltimateEntity from "../functions/ultimate-entities/get-ultimate-entity";
import getUltimateEntitiyDocument from "../functions/ultimate-entities-documents/get-ultimate-entitiy-document";
import updateUltimateEntityDocument from "../functions/ultimate-entities-documents-operations/update-ultimate-entity-document";
import deleteUltimateEntityDocument from "../functions/ultimate-entities-documents-operations/delete-ultimate-entity-document";

import getPagePathname from "../utils/get-page-pathname";

interface UltimateEntityDocumentPageContext {
  // after saving update it to te saved verion
  document?: UltimateEntityModel | undefined;

  defaultDocument?: UltimateEntityModel | undefined;
  entity?: UltimateEntity | undefined;
  fields?: UltimateEntityField[] | undefined;
  relations?: UltimateEntityRelation[] | undefined;

  //  submit: (data: UltimateEntityModel) => Promise<void>
  //  cancel: (data: UltimateEntityModel) => Promise<void>
  //  delete: (data: UltimateEntityModel) => Promise<void>

  submit: () => Promise<void>;
  cancel: () => Promise<void>;
  delete: () => Promise<void>;

  handleValueChange: (key: string, value: any) => void;

  isSubmitLoading: boolean;
  isCancelationLoading: boolean;
  isBeingDeleted: boolean;
  isDeleted: boolean;

  isLoading: boolean;
  error: boolean;

  ultimateEntityId: string;
  ultimateEntityDocumentId: string;

  haveChangesBeenMade: boolean;
}

const UltimateEntityDocumentPageContext =
  createContext<UltimateEntityDocumentPageContext | null>(null);

interface UltimateEntityDocumentPageProviderProps {
  children?: React.ReactNode;
  ultimateEntityId: string;
  ultimateEntityDocumentId: string;
}

export const UltimateEntityDocumentPageProvider = ({
  children,
  ultimateEntityDocumentId,
  ultimateEntityId,
}: UltimateEntityDocumentPageProviderProps) => {
  const prompt = usePrompt();
  const navigate = useNavigate();

  const [haveChangesBeenMade, setHaveChangesBeenMade] =
    useState<boolean>(false);

  const [error, setError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [entity, setEntity] = useState<UltimateEntity | undefined>(undefined);
  const [fields, setFields] = useState<UltimateEntityField[] | undefined>(
    undefined
  );
  const [relations, setRelations] = useState<
    UltimateEntityRelation[] | undefined
  >(undefined);
  const [defaultDocument, setDefaultDocument] = useState<
    UltimateEntityModel | undefined
  >(undefined);

  const [document, setDocument] = useState<UltimateEntityModel | undefined>(
    undefined
  );

  const [isBeingDeleted, setIsBeingDeleted] = useState<boolean>(false);
  const [haveBeenDeleted, setHaveBeenDeleted] = useState<boolean>(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [isCancelationLoading, setIsCancelationLoading] =
    useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      try {
        const {
          entity: { entity, fields, relations },
        } = await getUltimateEntity(ultimateEntityId);
        const { document } = await getUltimateEntitiyDocument(
          ultimateEntityId,
          ultimateEntityDocumentId
        );

        setDocument(document);
        setDefaultDocument(document);
        setFields(fields);
        setRelations(relations);
        setEntity(entity);
      } catch (error) {
        setError(true);
        console.log("[error]:", error);
        /**
         * if there is an error here, redirect to previous all page
         */
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  async function handleSubmit() {
    if (
      isSubmitLoading ||
      isCancelationLoading ||
      isBeingDeleted ||
      haveBeenDeleted
    )
      return;

    setIsSubmitLoading(true);

    try {
      const { document: newDocument } = await updateUltimateEntityDocument(
        ultimateEntityId,
        ultimateEntityDocumentId,
        {
          ...document,
          id: undefined,
          created_at: undefined,
          updated_at: undefined,
        }
      );

      // TODO: recheck to see which one we should keep
      setDefaultDocument(document);
      // setDefaultDocument(newDocument);
      // notify.success(
      //   "Updated document.",
      //   "Your changes have been successfully synced."
      // );

      setHaveChangesBeenMade(false);
    } catch (error) {
      try {
        // notify.error("Update failed.", JSON.stringify(error.response.data));
      } catch (error) {
        // notify.error("Update failed.", "Unknown reason.");
      }
    } finally {
      setIsSubmitLoading(false);
    }
  }

  async function handleDelete() {
    if (
      isSubmitLoading ||
      isCancelationLoading ||
      isBeingDeleted ||
      haveBeenDeleted
    )
      return;
    // show a backdrop loader

    setIsBeingDeleted(true);

    const confirmed = await prompt({
      title: "Are you sure ?",
      description: "Please confirm your action.",
    });

    try {
      if (confirmed) {
        await deleteUltimateEntityDocument(entity.id, ultimateEntityDocumentId);
        // notify.success("Successfully Deleted.", "You are being redirected..");
        navigate(getPagePathname.entityDocuments(entity.id));
        setHaveBeenDeleted(true);
      }
    } catch (error) {
      // notify.error("Failed to delete.", "Something went wrong, try again.");
      setHaveBeenDeleted(false);
    } finally {
      setIsBeingDeleted(false);
    }
  }

  async function handleCancel() {
    if (
      isSubmitLoading ||
      isCancelationLoading ||
      isBeingDeleted ||
      haveBeenDeleted
    )
      return;

    setIsCancelationLoading(true);

    try {
      const oldDocument = JSON.parse(
        JSON.stringify(defaultDocument)
      ) as typeof document;
      setDocument(oldDocument);
      setHaveChangesBeenMade(false);
    } catch (error) {
    } finally {
      setIsCancelationLoading(false);
    }
  }

  function handleValueChange(key: string, value: any) {
    const newDocument = JSON.parse(JSON.stringify(document)) as typeof document;
    newDocument[key] = value;
    setDocument(newDocument);
    setHaveChangesBeenMade(true);
  }

  return (
    <UltimateEntityDocumentPageContext.Provider
      value={{
        isBeingDeleted,
        isSubmitLoading,
        isCancelationLoading,
        isDeleted: haveBeenDeleted,

        cancel: handleCancel,
        delete: handleDelete,
        submit: handleSubmit,

        document,
        handleValueChange,

        isLoading,
        error,

        defaultDocument,
        entity,
        fields,
        relations,

        ultimateEntityDocumentId,
        ultimateEntityId,

        haveChangesBeenMade,
      }}
    >
      {children}
    </UltimateEntityDocumentPageContext.Provider>
  );
};

export const useUltimateEntityDocumentPage = () => {
  const context = useContext(UltimateEntityDocumentPageContext);

  if (context === null) {
    throw new Error(
      "useUltimateEntityDocumentPage must be used within a UltimateEntityDocumentPageProvider"
    );
  }
  return context;
};
