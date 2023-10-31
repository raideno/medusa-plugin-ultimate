import useSWR, { mutate } from "swr";
import getUltimateEntitiyDocuments from "../../functions/ultimate-entities-documents/get-ultimate-entitiy-documents";

export const useUltimateEntityDocumentsKey = (ultimateEntityId: string) =>
  `/ultimate-entities/${ultimateEntityId}/documents/`;

export type useUltimateEntityDocumentsReturnType = Awaited<
  ReturnType<typeof getUltimateEntitiyDocuments>
>;

export default (ultimateEntityId: string) =>
  useSWR<useUltimateEntityDocumentsReturnType>(
    useUltimateEntityDocumentsKey(ultimateEntityId),
    getUltimateEntitiyDocuments.bind(null, ultimateEntityId)
  );

export const mutateUltimateEntityDocuments = (
  ultimateEntityId: string,
  data: (
    oldData: useUltimateEntityDocumentsReturnType
  ) => Promise<useUltimateEntityDocumentsReturnType>
) => {
  return mutate<useUltimateEntityDocumentsReturnType>(
    useUltimateEntityDocumentsKey(ultimateEntityId),
    data
  );
};
