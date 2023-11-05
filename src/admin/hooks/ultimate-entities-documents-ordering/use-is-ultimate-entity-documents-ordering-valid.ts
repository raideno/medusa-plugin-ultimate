import useSWR, { mutate } from "swr";
import areUltimateEntityDocumentsOrdered from "../../functions/ultimate-entites-documents-ordering/are-ultimate-entity-documents-ordered";

export const useIsUltimateEntityDocumentsOrderingValidKey = (ultimateEntityId: string) =>
    `/ultimate-entities/${ultimateEntityId}/ordering/is-valid/`;

export type useIsUltimateEntityDocumentsOrderingValidType = Awaited<
    ReturnType<typeof areUltimateEntityDocumentsOrdered>
>;

export default (ultimateEntityId: string) =>
    useSWR<useIsUltimateEntityDocumentsOrderingValidType>(
        useIsUltimateEntityDocumentsOrderingValidKey(ultimateEntityId),
        areUltimateEntityDocumentsOrdered.bind(null, ultimateEntityId)
    );

export const mutateIsUltimateEntityDocumentsOrderingValid = (
    ultimateEntityId: string,
    data: (
        oldData: useIsUltimateEntityDocumentsOrderingValidType
    ) => Promise<useIsUltimateEntityDocumentsOrderingValidType>
) => {
    return mutate<useIsUltimateEntityDocumentsOrderingValidType>(
        useIsUltimateEntityDocumentsOrderingValidKey(ultimateEntityId),
        data
    );
};
