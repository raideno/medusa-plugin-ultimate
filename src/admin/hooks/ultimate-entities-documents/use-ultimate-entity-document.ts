import useSWR, { MutatorOptions, mutate } from "swr";
import getUltimateEntitiyDocument from "../../functions/ultimate-entities-documents/get-ultimate-entitiy-document";

export const useUltimateEntityDocumentKey = (
  ultimateEntityId: string,
  ultimateEntityDocumentId: string
) =>
  `/ultimate-entities/${ultimateEntityId}/documents/${ultimateEntityDocumentId}/`;

export type useUltimateEntityDocumentReturnType = Awaited<
  ReturnType<typeof getUltimateEntitiyDocument>
>;

export default (ultimateEntityId: string, ultimateEntityDocumentId: string) =>
  useSWR<useUltimateEntityDocumentReturnType>(
    useUltimateEntityDocumentKey(ultimateEntityId, ultimateEntityDocumentId),
    getUltimateEntitiyDocument.bind(
      null,
      ultimateEntityId,
      ultimateEntityDocumentId
    )
  );

export const mutateUltimateEntityDocument = (
  ultimateEntityId: string,
  ultimateEntityDocumentId: string,
  data: (
    oldData: useUltimateEntityDocumentReturnType
  ) => Promise<useUltimateEntityDocumentReturnType>,
  options?: boolean | MutatorOptions<useUltimateEntityDocumentReturnType, useUltimateEntityDocumentReturnType>,
) => {
  return mutate<useUltimateEntityDocumentReturnType>(
    useUltimateEntityDocumentKey(ultimateEntityId, ultimateEntityDocumentId),
    data,
    options
  );
};
