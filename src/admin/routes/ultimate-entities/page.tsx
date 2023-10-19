import { CircleStack } from "@medusajs/icons";
import { RouteConfig, RouteProps } from "@medusajs/admin";

import UltimateEntityPageHeader from "../../components/layout/ultimate-entity-page-header";
import UltimateEntitiesPageEntitites from "./components/ultimate-entities-page-entities";

export const config: RouteConfig = {
  link: {
    icon: CircleStack,
    label: "Ultimate Entities",
  },
};

const UltimateEntitiesPage = ({ notify }: RouteProps) => {
  return (
    <div>
      <UltimateEntityPageHeader
        title="Ultimate Entities"
        description={
          "Here will be listed all the models you have marked with the @UltimateEntity decorator"
        }
      />
      <div className="flex flex-col gap-y-xsmall">
        <UltimateEntitiesPageEntitites />
      </div>
      <div className="h-xlarge w-full" />
    </div>
  );
};

export default UltimateEntitiesPage;
