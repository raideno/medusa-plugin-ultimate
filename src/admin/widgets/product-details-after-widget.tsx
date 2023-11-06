import { useState, useEffect, FormEvent } from "react";

import { useMedusa } from "medusa-react";
import { Button, Heading, Text } from "@medusajs/ui";
import { ProductDetailsWidgetProps, WidgetConfig } from "@medusajs/admin";

import useUltimateEntity from "../hooks/ultimate-entities/use-ultimate-entity";

import { UltimateEntityDocument } from "../../types/ultimate-entity-document";

import updateUltimateEntityDocument from "../functions/ultimate-entities-documents-operations/update-ultimate-entity-document";

import Skeleton from "../components/layout/skeleton";
import ErrorLayout from "../components/layout/error-layout";
import UltimateEntityFieldContainer from "../components/ultimate-entity-field/ultimate-entity-field-container";
import UltimateEntityRelationContainer from "../components/ultimate-entity-relation/ultimate-entity-relation-container";
import { UltimateEntityRelationTypes } from "../../types/ultimate-entity-relation-types";

export enum UltimateEntityFieldTypes {
  STRING = "STRING",
  TEXT = "TEXT",
  BOOLEAN = "BOOLEAN",
  IMAGE = "IMAGE",
  SELECT = "SELECT",
  UNKNOWN = "UNKNOWN",
  STRING_ARRAY = "STRING_ARRAY",
  DATE = "DATE",
  MARKDOWN = "MARKDOWN",
  COLOR = "COLOR",
}

const EXCLUDED_FIELDS_IDS = ["id", "created_at", "updated_at"];
const DEFUALT_DOCUMENT = {
  id: "",
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now()),
};

const ProductDetailsAfterWidget = ({
  product,
  notify,
}: ProductDetailsWidgetProps) => {
  const medusa = useMedusa();

  const { data, isLoading, error } = useUltimateEntity("product");

  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [isCancelationLoading, setIsCancelationLoading] =
    useState<boolean>(false);

  const [isDocumentError, setIsDocumentError] = useState<boolean>(false);
  const [isDocumentLoading, setIsDocumentLoading] = useState<boolean>(true);
  const [document, setDocument] = useState<
    UltimateEntityDocument | undefined | null
  >(undefined);

  useEffect(() => {
    if (!isLoading) {
      if (data && data.entity && !error) {
        const { entity, fields } = data.entity;

        setIsDocumentLoading(true);
        // setDocument(data.document);

        medusa.client.admin.products
          .list({
            id: product.id,
            fields: fields
              .filter(
                (field) => field.type !== UltimateEntityFieldTypes.UNKNOWN
              )
              .map((field) => field.id)
              .join(","),
          })
          .then(({ products, count }) => {
            if (products.length === 0) {
              // say error
              setIsDocumentError(true);
              return;
            } else {
              setDocument(products[0] as any);
            }
          })
          .catch(() => { })
          .finally(() => {
            setIsDocumentLoading(false);
          });
      } else {
        setDocument(null);
      }
    }
  }, [data, isLoading, error]);

  async function handleUpdateButtonClick() {
    await handleSubmit(undefined);
  }

  async function handleSubmit(event?: FormEvent<HTMLFormElement>) {
    if (event) event.preventDefault();

    if (isSubmitLoading || isCancelationLoading) return;

    setIsSubmitLoading(true);

    try {
      const { entity, fields, relations } = data.entity;

      const body = JSON.parse(JSON.stringify(document));

      Object.keys(body).forEach((key) => {
        const correspondingField = fields.find(
          (field) =>
            field.id === key &&
            field.type &&
            field.type !== UltimateEntityFieldTypes.UNKNOWN
        );
        const correspondingRelation = relations.find(
          (relation) => relation.id === key && relation.type
          // && relation.type !== UltimateEntityFieldTypes.UNKNOWN
        );

        if (
          (!correspondingField ||
            correspondingField === undefined ||
            correspondingField === null) &&
          (!correspondingRelation ||
            correspondingRelation === undefined ||
            correspondingRelation === null)
        ) {
          delete body[key];
          body[key] = undefined;
        }
      });

      // const {
      //   document: { id: documentId },
      // } = await updateUltimateEntityDocument(entity.id, product.id, {
      //   ...body,
      //   id: undefined,
      //   created_at: undefined,
      //   updated_at: undefined,
      // });

      await medusa.client.admin.products.update(product.id, {
        ...body,
        id: undefined,
        created_at: undefined,
        updated_at: undefined,
      });

      notify.success("Update succeeded.", "Everything have been updated.");
    } catch (error) {
      notify.error(
        "Update have failed.",
        "Check console / network tab to knwo more and please contact plugin assistance to report the issue."
      );
    } finally {
      setIsSubmitLoading(false);
    }
  }

  async function handleCancelButtonClick() {
    if (isSubmitLoading || isCancelationLoading) return;

    setIsCancelationLoading(true);

    try {
      setDocument(product);
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

  if (isLoading) return <Skeleton className="w-full h-[512px]" />;

  if (error) return <ErrorLayout />;

  const response = data.entity;

  if (!response) return null;

  const { entity, fields, relations } = data.entity;

  if (isDocumentLoading) return <Skeleton className="w-full h-[512px]" />;

  if (isDocumentError) return <ErrorLayout />;

  return (
    <div className="pt-large pb-xlarge rounded-rounded bg-grey-0 border-grey-20 border">
      <div className="px-xlarge ">
        <Heading level="h1" className="text-grey-90 inter-xlarge-semibold">
          Ultimate Entity Extension
        </Heading>
        <Text className="inter-base-regular text-grey-50 mt-2 whitespace-pre-wrap">
          Here will be listed all of the field you marked as
          UltimateEntityField.
        </Text>
      </div>
      <div className="w-full mt-8 px-xlarge ">
        <form className="w-full flex flex-col gap-2" onSubmit={handleSubmit}>
          {fields
            .filter((field) => !EXCLUDED_FIELDS_IDS.includes(field.id))
            .filter((field) => field.type !== UltimateEntityFieldTypes.UNKNOWN)
            .map((field) => {
              return (
                <UltimateEntityFieldContainer
                  document={document}
                  handleValueChange={handleValueChange}
                  key={field.id}
                  defaultDocument={DEFUALT_DOCUMENT}
                  field={field}
                />
              );
            })}
          {relations
            .filter(
              (relation) =>
                relation.type &&
                relation.type !== UltimateEntityRelationTypes.UNKNOWN
            )
            .map((relation) => {
              return (
                <UltimateEntityRelationContainer
                  entity={entity}
                  document={document}
                  handleValueChange={handleValueChange}
                  key={relation.id}
                  defaultDocument={DEFUALT_DOCUMENT}
                  relation={relation}
                />
              );
            })}
        </form>
      </div>
      <div className="pt-xlarge mt-8 px-xlarge border-t border-border flex flex-row items-center justify-between">
        <Button
          onClick={handleCancelButtonClick}
          disabled={isSubmitLoading}
          isLoading={isCancelationLoading}
          variant="secondary"
        >
          Discard Changes
        </Button>
        <Button
          onClick={handleUpdateButtonClick}
          disabled={isCancelationLoading}
          isLoading={isSubmitLoading}
          variant="primary"
        >
          Update
        </Button>
      </div>
    </div>
  );
};

export const config: WidgetConfig = {
  zone: "product.details.after",
};

export default ProductDetailsAfterWidget;
