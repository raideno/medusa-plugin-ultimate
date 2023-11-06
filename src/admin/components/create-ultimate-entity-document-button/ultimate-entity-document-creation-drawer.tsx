import { Button, Drawer, Heading, useToast } from "@medusajs/ui";
import { FormEvent, ChangeEvent, useState } from "react";

import { UltimateEntity } from "../../../types/ultimate-entity";
import { UltimateEntityDocument } from "../../../types/ultimate-entity-document";

import createUltimateEntityDocument from "../../functions/ultimate-entities-documents-operations/create-ultimate-entity-document";

import UltimateEntityField from "../ultimate-entity-field/ultimate-entity-field";
import UltimateEntityFieldContainer from "../ultimate-entity-field/ultimate-entity-field-container";
import { UltimateEntityRelation } from "../../../types/ultimate-entity-relation";
import UltimateEntityRelationContainer from "../ultimate-entity-relation/ultimate-entity-relation-container";
import groupBy from "../../utils/group-by";
import { mutateUltimateEntityDocument } from "../../hooks/ultimate-entities-documents/use-ultimate-entity-document";
import { mutateUltimateEntityDocuments } from "../../hooks/ultimate-entities-documents/use-ultimate-entity-documents";

const EXCLUDED_FIELDS_IDS = ["id", "created_at", "updated_at"];

interface UltimateEntityDocumentCreationDrawerProps {
  children: React.ReactNode;
  entity: UltimateEntity;
  fields: UltimateEntityField[];
  relations: UltimateEntityRelation[];
  onCreationComplete?: (document: UltimateEntityDocument) => Promise<void>;
  onCreationCancel?: () => void;
  defaultValues?: { [key: string]: any };
  //
  zIndex?: number;
}

const UltimateEntityDocumentCreationDrawer = ({
  entity,
  fields,
  relations,
  children: trigger,
  onCreationCancel,
  onCreationComplete,
  defaultValues,
  zIndex,
}: UltimateEntityDocumentCreationDrawerProps) => {
  const DEFUALT_DOCUMENT: UltimateEntityDocument = {
    id: undefined,
    created_at: undefined,
    updated_at: undefined,
    ...defaultValues,
  };

  const { toast } = useToast();

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [isCancelationLoading, setIsCancelationLoading] =
    useState<boolean>(false);

  const [document, setDocument] = useState<UltimateEntityDocument | undefined>(
    DEFUALT_DOCUMENT
  );

  async function handleCreateButtonClick() {
    await handleSubmit(undefined);
  }

  async function handleSubmit(event?: FormEvent<HTMLFormElement>) {
    if (event) event.preventDefault();

    if (isSubmitLoading || isCancelationLoading) return;

    setIsSubmitLoading(true);

    try {
      const { document: createdDocument } = await createUltimateEntityDocument(
        entity.id,
        {
          ...document,
          id: undefined,
          created_at: undefined,
          updated_at: undefined,
        }
      );

      await mutateUltimateEntityDocument(
        entity.id,
        createdDocument.id,
        async () => {
          return {
            document: createdDocument,
          };
        }
      );

      await mutateUltimateEntityDocuments(entity.id, async (oldData) => {
        oldData.documents.push(createdDocument);
        oldData.count = oldData.count + 1;
        return oldData;
      });

      if (onCreationComplete) await onCreationComplete(createdDocument);

      setIsDrawerOpen(false);
    } catch (error) {
      toast({
        variant: "success",
        title: "Document created.",
        description: "Your document have been created with success!",
      });
    } finally {
      setIsSubmitLoading(false);
    }
  }

  async function handleCancelButtonClick() {
    if (isSubmitLoading || isCancelationLoading) return;

    setIsCancelationLoading(true);

    try {
      setIsDrawerOpen(false);
      if (onCreationCancel) onCreationCancel();
    } catch (error) {
    } finally {
      setIsCancelationLoading(false);
    }
  }

  async function handleValueChange(key: string, value: any) {
    const newDocument = JSON.parse(JSON.stringify(document)) as typeof document;
    newDocument[key] = value;
    setDocument(newDocument);
  }

  async function handleDrawerOpenChange(open: boolean) {
    if (isSubmitLoading || isCancelationLoading) return;
    setIsDrawerOpen(open);
  }

  const everything = [
    ...fields
      .filter((field) => !EXCLUDED_FIELDS_IDS.includes(field.id))
      .map((field) => ({ ...field, field: true, relation: false })),
    ...relations.map((relation) => ({
      ...relation,
      relation: true,
      field: false,
    })),
  ];

  const groups = groupBy(everything, ["group"], "default-group");

  return (
    <Drawer open={isDrawerOpen} onOpenChange={handleDrawerOpenChange}>
      <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>
      <Drawer.Content className={`z-[${zIndex ? zIndex : 99}]`}>
        <Drawer.Header>
          <Drawer.Title>Create Document</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body className="h-full max-h-full overflow-y-auto">
          <form
            className="h-full max-h-full overflow-y-auto w-full flex flex-col gap-2"
            onSubmit={handleSubmit}
          >
            {groups[0].items.map((fieldOrRelation) => {
              if (fieldOrRelation.field) {
                const field = fieldOrRelation as UltimateEntityField;
                return (
                  <UltimateEntityFieldContainer
                    key={field.id}
                    field={field}
                    document={document}
                    defaultDocument={DEFUALT_DOCUMENT}
                    handleValueChange={handleValueChange}
                  />
                );
              }
              if (fieldOrRelation.relation) {
                const relation = fieldOrRelation as UltimateEntityRelation;
                return (
                  <UltimateEntityRelationContainer
                    entity={entity}
                    key={relation.id}
                    relation={relation}
                    document={document}
                    defaultDocument={DEFUALT_DOCUMENT}
                    handleValueChange={handleValueChange}
                  />
                );
              }
            })}
            {groups
              .splice(1)
              .map(({ name: groupName, items: groupFieldsOrRelations }) => {
                return (
                  <div
                    key={`fields-group-${groupName}`}
                    className="p-2 flex flex-col gap-2 border border-border rounded bg-white"
                  >
                    <Heading className="inter-large-semibold gap-x-base text-grey-40 flex">
                      {groupName}
                    </Heading>
                    <div className="flex flex-col gap-2">
                      {groupFieldsOrRelations.map((groupFieldsOrRelation) => {
                        if (groupFieldsOrRelation.field) {
                          const field =
                            groupFieldsOrRelation as UltimateEntityField;
                          return (
                            <UltimateEntityFieldContainer
                              key={field.id}
                              field={field}
                              document={document}
                              defaultDocument={DEFUALT_DOCUMENT}
                              handleValueChange={handleValueChange}
                            />
                          );
                        }
                        if (groupFieldsOrRelation.relation) {
                          const relation =
                            groupFieldsOrRelation as UltimateEntityRelation;
                          return (
                            <UltimateEntityRelationContainer
                              entity={entity}
                              key={relation.id}
                              relation={relation}
                              document={document}
                              defaultDocument={DEFUALT_DOCUMENT}
                              handleValueChange={handleValueChange}
                            />
                          );
                        }
                      })}
                    </div>
                  </div>
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
            onClick={handleCreateButtonClick}
            disabled={isCancelationLoading}
            isLoading={isSubmitLoading}
            variant="primary"
          >
            Create
          </Button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  );
};

export default UltimateEntityDocumentCreationDrawer;
