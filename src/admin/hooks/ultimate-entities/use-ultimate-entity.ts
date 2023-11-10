import useSWR from "swr";
import { BareFetcher, PublicConfiguration } from "swr/_internal";

import getUltimateEntity from "../../functions/ultimate-entities/get-ultimate-entity";

type UseSWRConfig<T> = Partial<PublicConfiguration<T, any, BareFetcher<T>>>

export default (ultimateEntityId: string, config?: UseSWRConfig<Awaited<ReturnType<typeof getUltimateEntity>>>) =>
  useSWR<Awaited<ReturnType<typeof getUltimateEntity>>>(
    `/ultimate-entities/${ultimateEntityId}/`,
    getUltimateEntity.bind(null, ultimateEntityId),
    config
  );
