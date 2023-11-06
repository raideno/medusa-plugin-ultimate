import { CircleStack } from "@medusajs/icons";
import { RouteConfig, RouteProps } from "@medusajs/admin";

import UltimateEntityPageHeader from "../../components/layout/ultimate-entity-page-header";
import UltimateEntitiesPageEntitites from "./components/ultimate-entities-page-entities";
import { Button, Heading, Text } from "@medusajs/ui";

export const config: RouteConfig = {
  link: {
    icon: CircleStack,
    label: "Ultimate Entities",
  },
};

const UltimateEntitiesPage = ({ notify }: RouteProps) => {
  return (
    <div>
      <div className="w-full mb-xlarge">
        <div className="w-full flex flex-row items-center justify-between">
          <Heading className="inter-2xlarge-semibold">{"Ultimate Entities"}</Heading>
          <a href="https://medusa-plugin-ultimate.raideno.xyz" target="_blank">
            <Button variant="primary">Plugin Documentation.</Button>
          </a>
        </div>
        <Text className="inter-base-regular text-grey-50">{"Here will be listed all the models you have marked with the @UltimateEntity decorator"}</Text>
      </div>
      <div className="flex flex-col gap-y-xsmall">
        <UltimateEntitiesPageEntitites />
      </div>
      <div className="h-xlarge w-full" />
    </div>
  );
};

export default UltimateEntitiesPage;
