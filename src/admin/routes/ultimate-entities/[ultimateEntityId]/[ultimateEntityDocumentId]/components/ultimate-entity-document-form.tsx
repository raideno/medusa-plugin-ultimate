import { FormEvent } from "react";
import { Heading } from "@medusajs/ui";

import { useUltimateEntityDocumentPage } from "../../../../../contexts/ultimate-entity-document-page";

import groupBy from "../../../../../utils/group-by";

import ErrorLayout from "../../../../../components/layout/error-layout";
import LoadingSkeletonsWrapper from "../../../../../components/layout/loading-skeletons-wrapper";
import UltimateEntitiyFieldSkeleton from "../../../../../components/ultimate-entity-field/ultimate-entity-field-skeleton";
import UltimateEntityFieldContainer from "../../../../../components/ultimate-entity-field/ultimate-entity-field-container";
import UltimateEntityRelationContainer from "../../../../../components/ultimate-entity-relation/ultimate-entity-relation-container";

import { UltimateEntityField } from "../../../../../../types/ultimate-entity-field";
import { UltimateEntityRelation } from "../../../../../../types/ultimate-entity-relation";

const EXCLUDED_FIELDS_IDS = ["id", "created_at", "updated_at", "deleted_at"];

interface UltimateEntityDocumentFormProps {}

const UltimateEntityDocumentForm = ({}: UltimateEntityDocumentFormProps) => {
  const {
    isLoading,
    error,
    submit,
    document,
    fields,
    relations,
    isSubmitLoading,
    isBeingDeleted,
    isDeleted,
    isCancelationLoading,

    entity,

    handleValueChange,
    defaultDocument,
  } = useUltimateEntityDocumentPage();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      isLoading ||
      isSubmitLoading ||
      isBeingDeleted ||
      isDeleted ||
      isCancelationLoading
    )
      return;

    await submit();
  }

  if (isLoading)
    return (
      <div className="flex flex-col gap-2">
        <LoadingSkeletonsWrapper
          iterations={fields ? fields.length : 12}
          keyPrefix="ultimate-entity-document-form-field-"
        >
          <UltimateEntitiyFieldSkeleton />
        </LoadingSkeletonsWrapper>
      </div>
    );

  if (error) return <ErrorLayout />;

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      {groups[0].items.map((fieldOrRelation) => {
        if (fieldOrRelation.field) {
          const field = fieldOrRelation as UltimateEntityField;
          return (
            <UltimateEntityFieldContainer
              key={field.id}
              field={field}
              document={document}
              defaultDocument={defaultDocument}
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
              defaultDocument={defaultDocument}
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
                    const field = groupFieldsOrRelation as UltimateEntityField;
                    return (
                      <UltimateEntityFieldContainer
                        key={field.id}
                        field={field}
                        document={document}
                        defaultDocument={defaultDocument}
                        handleValueChange={handleValueChange}
                      />
                    );
                  }
                  if (groupFieldsOrRelation.relation) {
                    const relation =
                      groupFieldsOrRelation as UltimateEntityRelation;
                    return (
                      <UltimateEntityRelationContainer
                        key={relation.id}
                        entity={entity}
                        relation={relation}
                        document={document}
                        defaultDocument={defaultDocument}
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
  );
};

export default UltimateEntityDocumentForm;
