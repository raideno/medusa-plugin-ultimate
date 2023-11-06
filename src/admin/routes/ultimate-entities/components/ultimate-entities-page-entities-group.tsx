import { Link } from "react-router-dom";

import { ChevronDown } from "@medusajs/icons";
import { Heading, IconButton, clx, useToggleState } from "@medusajs/ui";

import { UltimateEntity } from "../../../../types/ultimate-entity";

import getPagePathname from "../../../utils/get-page-pathname";

import UltimateEntityCard from "../../../components/ultimate-entity-card/ultimate-entity-card";

interface UltimateEntitiesPageEntitiesGroupProps {
    name: string;
    entities: UltimateEntity[];
    areGroupEntitiesShownByDefault?: boolean
}

const UltimateEntitiesPageEntitiesGroup = ({
    name,
    entities,
    areGroupEntitiesShownByDefault = false
}: UltimateEntitiesPageEntitiesGroupProps) => {

    const { state: areGroupEntitiesShown, toggle: toggleAreGroupEntitiesShown } = useToggleState(areGroupEntitiesShownByDefault);

    return (
        <div className="w-full flex flex-col gap-2" onClick={toggleAreGroupEntitiesShown}>
            <div className="w-full flex flex-row items-center justify-between mb-xsmall">
                <Heading className="font-sans font-medium h2-core inter-2xlarge-semibold">
                    {name}
                </Heading>
                <IconButton size="xlarge" variant="transparent">
                    <ChevronDown className={clx("transition-all", !areGroupEntitiesShown && "-rotate-90")} />
                </IconButton>
            </div>
            {areGroupEntitiesShown && entities
                .filter((entity) => !entity.hidden)
                .map((entity) => {
                    return (
                        <Link
                            key={entity.id}
                            to={getPagePathname.entityDocuments(entity.id)}
                        >
                            <UltimateEntityCard entity={entity} />
                        </Link>
                    );
                })}
        </div>
    )
}

export default UltimateEntitiesPageEntitiesGroup;