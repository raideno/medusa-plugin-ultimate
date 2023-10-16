import useSWR from "swr";
import getUltimateEntities from "../../functions/ultimate-entities/get-ultimate-entities";

export default () =>
  useSWR<Awaited<ReturnType<typeof getUltimateEntities>>>(
    "/ultimate-entities/",
    getUltimateEntities
  );
