import { ArrowUpTray } from "@medusajs/icons";
import { Button, Tooltip } from "@medusajs/ui";

interface UltimateEntityDocumentsPageImportaDataButtonProps {

}

const UltimateEntityDocumentsPageImportaDataButton = ({ }: UltimateEntityDocumentsPageImportaDataButtonProps) => {
    return (
        <Tooltip content="Not supported yet.">
            <Button className="rounded-tr-none rounded-br-none" variant="secondary">
                <ArrowUpTray />
                Import From CSV
            </Button>
        </Tooltip>
    )
}

export default UltimateEntityDocumentsPageImportaDataButton;