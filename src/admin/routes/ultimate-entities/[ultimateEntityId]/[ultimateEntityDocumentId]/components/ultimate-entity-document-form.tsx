import { FormEvent } from "react";

import { useUltimateEntityDocumentPage } from "../../../../../contexts/ultimate-entity-document-page";

import ErrorLayout from "../../../../../components/layout/error-layout";
import LoadingSkeletonsWrapper from "../../../../../components/layout/loading-skeletons-wrapper";
import UltimateEntitiyFieldSkeleton from "../../../../../components/ultimate-entity-field/ultimate-entity-field-skeleton";
import UltimateEntityField from "../../../../../components/ultimate-entity-field/ultimate-entity-field";

const EXCLUDED_FIELDS_IDS = ["id", "created_at", "updated_at"];

interface UltimateEntityDocumentFormProps {}

const UltimateEntityDocumentForm = ({}: UltimateEntityDocumentFormProps) => {
  const {
    isLoading,
    error,
    submit,
    document,
    fields,
    isSubmitLoading,
    isBeingDeleted,
    isDeleted,
    isCancelationLoading,

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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      {fields
        .filter((field) => !EXCLUDED_FIELDS_IDS.includes(field.id))
        .map((field) => {
          return (
            <UltimateEntityField
              key={field.id}
              field={field}
              document={document}
              defaultDocument={defaultDocument}
              handleValueChange={handleValueChange}
            />
          );
        })}
    </form>
  );
};

export default UltimateEntityDocumentForm;
