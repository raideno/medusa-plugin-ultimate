import UltimateEntityDocumentCreationDrawer from "./ultimate-entity-document-creation-drawer";
import { UltimateEntity } from "../../../types/ultimate-entity";
import { UltimateEntityField } from "../../../types/ultimate-entity-field";
import { UltimateEntityModel } from "../../../types/ultimate-entity-model";
import { UltimateEntityRelation } from "../../../types/ultimate-entity-relation";

interface CreateUltimateEntityDocumentButtonProps {
  entity: UltimateEntity;
  fields: UltimateEntityField[];
  relations: UltimateEntityRelation[];
  onCreationComplete?: (document: UltimateEntityModel) => Promise<void>;
  onCreationCancel?: () => void;
  children: React.ReactNode;
  defaultValues?: { [key: string]: any };
}

const CreateUltimateEntityDocumentButton = ({
  entity,
  fields,
  relations,
  onCreationCancel,
  onCreationComplete,
  children,
  defaultValues,
}: CreateUltimateEntityDocumentButtonProps) => {
  return (
    <UltimateEntityDocumentCreationDrawer
      fields={fields}
      relations={relations}
      entity={entity}
      onCreationCancel={onCreationCancel}
      onCreationComplete={onCreationComplete}
      defaultValues={defaultValues}
    >
      {children}
      {/* <Button variant="secondary">Create Document</Button> */}
    </UltimateEntityDocumentCreationDrawer>
  );
};

export default CreateUltimateEntityDocumentButton;
