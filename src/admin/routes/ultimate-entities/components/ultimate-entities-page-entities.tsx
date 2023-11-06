import { Button, Text } from "@medusajs/ui";

import useUltimateEntities from "../../../hooks/ultimate-entities/use-ultimate-entities";

import groupBy from "../../../utils/group-by";

import ErrorLayout from "../../../components/layout/error-layout";
import LoadingSkeletonsWrapper from "../../../components/layout/loading-skeletons-wrapper";
import UltimateEntityCardSkeleton from "../../../components/ultimate-entity-card/ultimate-entity-card-skeleton";

import UltimateEntitiesPageEntitiesGroup from "./ultimate-entities-page-entities-group";

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

  const groups = groupBy(entities, ["entity", "group"], "Entities");

  if (groups.length === 1 && groups[0].items.length === 0)
    return (
      <div className="w-full py-8 flex flex-col items-center justify-center">
        <Text className="font-normal font-sans txt-medium inter-base-regular text-grey-50">
          You haven't created any ultimate entity yet :(
        </Text>
        <a href="https://medusa-plugin-ultimate.raideno.xyz" target="_blank">
          <Button variant="primary">Need Help ? Visit Plugin Documentation.</Button>
        </a>
      </div>
    );

  return (
    <>
      {groups.map(({ name, items: entities }, groupIndex) => {
        return (
          <>
            <UltimateEntitiesPageEntitiesGroup
              key={"entities-group-" + name}
              name={name}
              entities={entities.map(({ entity }) => entity)}
              areGroupEntitiesShownByDefault={groupIndex === 0}
            />
            {groupIndex !== groups.length - 1 && (
              <div className="w-full h-[1px] mb-xsmall mt-xsmall border border-border rounded" />
            )}
          </>
        );
      })}
    </>
  );
};

export default UltimateEntitiesPageEntitites;
