import useSWR from "swr";
import getUltimateEntity from "../../functions/ultimate-entities/get-ultimate-entity";

export default (ultimateEntityId: string) =>
  useSWR<Awaited<ReturnType<typeof getUltimateEntity>>>(
    `/ultimate-entities/${ultimateEntityId}/`,
    getUltimateEntity.bind(null, ultimateEntityId)
  );
