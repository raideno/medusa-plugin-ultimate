import { startCase } from "lodash";

import { Badge } from "@medusajs/ui";

import { UltimateEntity } from "../../../../../../types/ultimate-entity";
import { UltimateEntityDocument } from "../../../../../../types/ultimate-entity-document";

interface UltimateEntityDocumentInfosOrderingProps {
    entity: UltimateEntity;
    document: UltimateEntityDocument;
}

const UltimateEntityDocumentInfosOrdering = ({
    entity,
    document
}: UltimateEntityDocumentInfosOrderingProps) => {

    if (!entity.ordering || !entity.ordering.enabled)
        return null;

    return (
        <div className="group w-full flex flex-row items-center gap-1">
            <Badge>{entity.ordering.positionPropertyName}</Badge>
            <Badge>{startCase(document[entity.ordering.positionPropertyName])}</Badge>
        </div>
    )
}

export default UltimateEntityDocumentInfosOrdering;