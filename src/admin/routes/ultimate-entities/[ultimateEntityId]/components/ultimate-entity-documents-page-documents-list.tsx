import { orderBy } from "lodash";

import { Text } from "@medusajs/ui";

import { UltimateEntity } from "../../../../../types/ultimate-entity";
import { UltimateEntityDocument } from "../../../../../types/ultimate-entity-document";

import { Filter, Sorting } from "../../../../contexts/ultimate-entity-documents-page";

import UltimateEntityDocumentCard, {
  UltimateEntityDocumentEditPages,
} from "../../../../components/ultimate-entity-document-card/ultimate-entity-document-card";

interface UltimateEntityDocumentsPageDocumentsListProps {
  entity: UltimateEntity;
  filter: Filter;
  sorting: Sorting
  documents: UltimateEntityDocument[];
}

const UltimateEntityDocumentsPageDocumentsList = ({
  entity,
  filter,
  sorting,
  documents
}: UltimateEntityDocumentsPageDocumentsListProps) => {

  const filteredDocuments = documents.filter((document) => {
    if (!filter || !filter.value || filter.value.trim() === "") return true;
    else
      return (document[filter.field] as string)
        .toLocaleLowerCase()
        .includes(filter.value.toLocaleLowerCase());
  });

  if (filteredDocuments.length === 0)
    return (
      <div className="w-full py-8 flex flex-col items-center justify-center">
        <Text className="font-normal font-sans txt-medium inter-base-regular text-grey-50">
          No document match for filter :(
        </Text>
      </div>
    );

  return (
    <>
      {orderBy(filteredDocuments, [sorting.field], [sorting.direction]).map(
        (document) => {
          return (
            <UltimateEntityDocumentCard
              entity={entity}
              document={document}
              key={entity.id + "-" + document.id}
              editPage={UltimateEntityDocumentEditPages.EXTERNAL}
            />
          );
        }
      )}
    </>
  );
};

export default UltimateEntityDocumentsPageDocumentsList;
