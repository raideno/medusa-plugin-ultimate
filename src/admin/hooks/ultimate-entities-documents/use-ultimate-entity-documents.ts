import useSWR from "swr";
import getUltimateEntitiyDocuments from "../../functions/ultimate-entities-documents/get-ultimate-entitiy-documents";
import { GetUltimateEntityDocumentsResponse } from "../../../types/api/get-ultimate-entity-documents-response";

export default (ultimateEntityId: string) =>
  useSWR<Awaited<ReturnType<typeof getUltimateEntitiyDocuments>>>(
    `/ultimate-entities/${ultimateEntityId}/documents/`,
    getUltimateEntitiyDocuments.bind(null, ultimateEntityId)
  );
