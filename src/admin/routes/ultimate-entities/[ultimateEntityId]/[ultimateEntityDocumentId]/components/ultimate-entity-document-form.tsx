import { FormEvent } from "react";

import { useUltimateEntityDocumentPage } from "../../../../../contexts/ultimate-entity-document-page";

import UltimateEntityFormField from "./ultimate-entity-document-form-field";
import UltimateEntityFormFieldSkeleton from "./ultimate-entity-document-form-field-skeleton";

import ErrorLayout from "../../../../../components/error-layout";
import LoadingSkeletonsWrapper from "../../../../../components/loading-skeletons-wrapper";

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
          <UltimateEntityFormFieldSkeleton />
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
            <UltimateEntityFormField
              handleValueChange={handleValueChange}
              document={document}
              defaultDocument={defaultDocument}
              key={field.id}
              field={field}
            />
          );
        })}
    </form>
  );
};

export default UltimateEntityDocumentForm;
