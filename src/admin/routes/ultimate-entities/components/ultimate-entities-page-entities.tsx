import { Heading } from "@medusajs/ui";
import { Link } from "react-router-dom";

import { UltimateEntity } from "../../../../types/ultimate-entity";
import { UltimateEntityField } from "../../../../types/ultimate-entity-field";

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

  const groups: {
    name: string;
    entities: { fields: UltimateEntityField[]; entity: UltimateEntity }[];
  }[] = [
    {
      name: "default",
      entities: [],
    },
  ];

  entities.forEach(({ entity, fields }) => {
    if (entity.group) {
      const group = groups.find((group) => group.name === entity.group);
      if (group) {
        // group exist, push only
        group.entities.push({
          entity,
          fields,
        });
      } else {
        // create the gruop and push
        groups.push({
          name: entity.group,
          entities: [
            {
              entity,
              fields,
            },
          ],
        });
      }
    } else {
      groups[0].entities.push({ entity, fields });
    }
  });

  return (
    <>
      {groups.map(
        ({ name: groupName, entities: groupEntities }, groupIndex) => {
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
        }
      )}
    </>
  );
};

export default UltimateEntitiesPageEntitites;
