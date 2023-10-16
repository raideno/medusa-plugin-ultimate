import useSWR from "swr";
import getUltimateEntitiyDocument from "../../functions/ultimate-entities-documents/get-ultimate-entitiy-document";

export default (ultimateEntityId: string, ultimateEntityDocumentId: string) =>
  useSWR<Awaited<ReturnType<typeof getUltimateEntitiyDocument>>>(
    `/ultimate-entities/${ultimateEntityId}/documents/${ultimateEntityDocumentId}/`,
    getUltimateEntitiyDocument.bind(
      null,
      ultimateEntityId,
      ultimateEntityDocumentId
    )
  );
