import { groupBy } from "lodash";
import { Heading } from "@medusajs/ui";
import { Link } from "react-router-dom";

import useUltimateEntities from "../../../hooks/ultimate-entities/use-ultimate-entities";

import getPagePathname from "../../../utils/get-page-pathname";

import ErrorLayout from "../../../components/layout/error-layout";
import UltimateEntityCard from "../../../components/ultimate-entity-card/ultimate-entity-card";
import LoadingSkeletonsWrapper from "../../../components/layout/loading-skeletons-wrapper";
import UltimateEntityCardSkeleton from "../../../components/ultimate-entity-card/ultimate-entity-card-skeleton";

const UltimateEntitiesPageEntitites = () => {
  const { data, isLoading, error } = useUltimateEntities();

  if (isLoading)
    return (
      <LoadingSkeletonsWrapper
        iterations={12}
        keyPrefix={"ultimate-entities-page-entities-entitiy-skeleton-"}
      >
        <UltimateEntityCardSkeleton />
      </LoadingSkeletonsWrapper>
    );

  if (error || !data || data === undefined) return <ErrorLayout />;

  const entities = data.entities;

  const groups = Object.keys(groupBy(entities, "group")).map(
    (key, _, groups) => [key, groups[key]]
  );

  return (
    <>
      {groups.map(([groupName, groupEntities], groupIndex) => {
        return (
          <div className="flex flex-col gap-2">
            <Heading className="font-sans font-medium h2-core inter-2xlarge-semibold mb-xsmall">
              {groupName}
            </Heading>
            {groupEntities
              .filter(({ entity, fields }) => !entity.hidden)
              .map(({ entity, fields }) => {
                return (
                  // TODO: have those links in the configuration file
                  <Link
                    key={entity.id}
                    to={getPagePathname.entityDocuments(entity.id)}
                  >
                    <UltimateEntityCard entity={entity} />
                  </Link>
                );
              })}
            {groupIndex !== groups.length - 1 && (
              <div className="w-full h-[1px] border border-border rounded" />
            )}
          </div>
        );
      })}
    </>
  );
};

export default UltimateEntitiesPageEntitites;
