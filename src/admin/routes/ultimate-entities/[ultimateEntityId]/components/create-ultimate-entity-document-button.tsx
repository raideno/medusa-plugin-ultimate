import { Button } from "@medusajs/ui";
import UltimateEntityDocumentCreationDrawer from "./ultimate-entity-document-creation-drawer";
import { UltimateEntity } from "../../../../../types/ultimate-entity";
import { UltimateEntityField } from "../../../../../types/ultimate-entity-field";

interface CreateUltimateEntityDocumentButtonProps {
  entity: UltimateEntity;
  fields: UltimateEntityField[];
}

const CreateUltimateEntityDocumentButton = ({
  entity,
  fields,
}: CreateUltimateEntityDocumentButtonProps) => {
  return (
    <UltimateEntityDocumentCreationDrawer entity={entity} fields={fields}>
      <Button variant="secondary">Create Document</Button>
    </UltimateEntityDocumentCreationDrawer>
  );
};

export default CreateUltimateEntityDocumentButton;
