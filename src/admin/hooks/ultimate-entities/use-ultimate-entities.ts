import useSWR from "swr";
import { BareFetcher, PublicConfiguration } from "swr/_internal";

import getUltimateEntities from "../../functions/ultimate-entities/get-ultimate-entities";

type UseSWRConfig<T> = Partial<PublicConfiguration<T, any, BareFetcher<T>>>

export default (config?: UseSWRConfig<Awaited<ReturnType<typeof getUltimateEntities>>>) =>
  useSWR<Awaited<ReturnType<typeof getUltimateEntities>>>(
    "/ultimate-entities/",
    getUltimateEntities,
    config
  );
