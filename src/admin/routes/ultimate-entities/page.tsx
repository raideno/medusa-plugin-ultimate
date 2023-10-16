import { Link } from "react-router-dom";
import { Heading, Text } from "@medusajs/ui";
import { CircleStack } from "@medusajs/icons";
import { RouteConfig, RouteProps } from "@medusajs/admin";

import useUltimateEntities from "../../hooks/ultimate-entities/use-ultimate-entities";
import UltimateEntityCard from "./components/ultimate-entity-card";
import UltimateEntityPageHeader from "../../components/ultimate-entity-page-header";
import {
  ARE_ULTIMATE_ENTITIES_ON_SIDEBAR,
  ULTIMATE_ENTITIES_FRONTEND_PATH,
  ULTIMATE_ENTITIES_SIDEBAR_LABEL,
} from "../../config-values";
import UltimateEntitiesPageEntitites from "./components/ultimate-entities-page-entities";

export const config: RouteConfig = {
  link: {
    icon: CircleStack,
    label: "Ultimate Entities",
  },
};

// export const config: RouteConfig = {
//   link: ARE_ULTIMATE_ENTITIES_ON_SIDEBAR
//     ? {
//         icon: CircleStack,
//         label: ULTIMATE_ENTITIES_SIDEBAR_LABEL,
//       }
//     : undefined,
// };

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
