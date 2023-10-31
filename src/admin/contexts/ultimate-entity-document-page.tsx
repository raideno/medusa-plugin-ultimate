"use client";

import React from "react";

import { usePrompt, useToast } from "@medusajs/ui";

import { useNavigate } from "react-router-dom";
import { createContext, useEffect, useContext, useState } from "react";

import { UltimateEntity } from "../../types/ultimate-entity";
import { UltimateEntityModel } from "../../types/ultimate-entity-model";
import { UltimateEntityField } from "../../types/ultimate-entity-field";
import { UltimateEntityRelation } from "../../types/ultimate-entity-relation";

import getUltimateEntity from "../functions/ultimate-entities/get-ultimate-entity";
import getUltimateEntitiyDocument from "../functions/ultimate-entities-documents/get-ultimate-entitiy-document";
import updateUltimateEntityDocument from "../functions/ultimate-entities-documents-operations/update-ultimate-entity-document";
import deleteUltimateEntityDocument from "../functions/ultimate-entities-documents-operations/delete-ultimate-entity-document";

import getPagePathname from "../utils/get-page-pathname";
import { mutateUltimateEntityDocuments } from "../hooks/ultimate-entities-documents/use-ultimate-entity-documents";
import { mutateUltimateEntityDocument } from "../hooks/ultimate-entities-documents/use-ultimate-entity-document";

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

  const { toast } = useToast();

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

    const bodyData = JSON.parse(JSON.stringify(document));

    Object.keys(bodyData).forEach((key) => {
      if (
        ![...relations.map((r) => r.id), ...fields.map((f) => f.id)].includes(
          key
        )
      ) {
        bodyData[key] = undefined;
        delete bodyData[key];
      }
    });

    try {
      const { document: newDocument } = await updateUltimateEntityDocument(
        ultimateEntityId,
        ultimateEntityDocumentId,
        {
          ...bodyData,
          id: undefined,
          created_at: undefined,
          updated_at: undefined,
        }
      );

      // TODO: mutate and update it on both documents and document
      await mutateUltimateEntityDocuments(entity.id, async (oldData) => {
        const documentIndex = oldData.documents.findIndex(
          (d) => d.id === ultimateEntityDocumentId
        );
        oldData.documents[documentIndex] = newDocument;
        return oldData;
      });

      await mutateUltimateEntityDocument(
        ultimateEntityId,
        ultimateEntityDocumentId,
        async (oldData) => {
          oldData.document = newDocument;
          return oldData;
        }
      );

      toast({
        title: "Updated Completed!",
        description: "Your document have been updated.",
        variant: "success",
      });

      // TODO: recheck to see which one we should keep
      setDefaultDocument(newDocument);

      setHaveChangesBeenMade(false);
    } catch (error) {
      try {
        toast({
          title: "Failed to update!",
          description:
            "Something went wrong, try again or open console to know more.",
          variant: "error",
        });
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

        // TODO: mutate and update it on both documents and document
        await mutateUltimateEntityDocuments(entity.id, async (oldData) => {
          const documentIndex = oldData.documents.findIndex(
            (d) => d.id === ultimateEntityDocumentId
          );
          oldData.documents.splice(documentIndex, 1);
          oldData.count = oldData.count - 1;
          return oldData;
        });

        toast({
          title: "Document have been Deleted!",
          description: "You are being redirected now.",
          variant: "success",
        });

        navigate(getPagePathname.entityDocuments(entity.id));

        setHaveBeenDeleted(true);
      }
    } catch (error) {
      toast({
        title: "Failed to Delete document.",
        description:
          "Something went wrong, try again or open console to know more.",
        variant: "error",
      });
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
