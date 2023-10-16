import { Link } from "react-router-dom";
import useUltimateEntities from "../../../hooks/ultimate-entities/use-ultimate-entities";
import { ULTIMATE_ENTITIES_FRONTEND_PATH } from "../../../config-values";
import UltimateEntityCard from "./ultimate-entity-card";
import UltimateEntitySkeletonCard from "./ultimate-entity-skeleton-card";
import ErrorLayout from "../../../components/error-layout";
import LoadingSkeletonsWrapper from "../../../components/loading-skeletons-wrapper";

const UltimateEntitiesPageEntitites = () => {
  const { data, isLoading, error } = useUltimateEntities();

  if (isLoading)
    return (
      <LoadingSkeletonsWrapper
        iterations={12}
        keyPrefix={"ultimate-entities-page-entities-entitiy-skeleton-"}
      >
        <UltimateEntitySkeletonCard />
      </LoadingSkeletonsWrapper>
    );

  if (error || !data || data === undefined) return <ErrorLayout />;

  const entities = data.entities;

  return (
    <>
      {entities.map(({ entity, fields }) => {
        return (
          // TODO: have those links in the configuration file
          <Link
            key={entity.id}
            to={`${ULTIMATE_ENTITIES_FRONTEND_PATH}/${entity.id}/`}
          >
            <UltimateEntityCard entity={entity} />
          </Link>
        );
      })}
    </>
  );
};

export default UltimateEntitiesPageEntitites;
