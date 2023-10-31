import { Button, IconButton, Tooltip } from "@medusajs/ui";
import { useUltimateEntityDocumentPage } from "../../../../../contexts/ultimate-entity-document-page";
import { Trash } from "@medusajs/icons";
import Skeleton from "../../../../../components/layout/skeleton";

const UltimateEntityDocumentControlsBar = () => {
  const {
    haveChangesBeenMade,

    isLoading,
    error,

    isBeingDeleted,
    isSubmitLoading,
    isCancelationLoading,
    isDeleted: haveBeenDeleted,

    cancel: handleCancel,
    delete: handleDelete,
    submit: hanldeSubmit,
  } = useUltimateEntityDocumentPage();

  if (isLoading) return <Skeleton className="w-full fixed bottom-0 h-20" />;

  if (error) return null;

  return (
    <div className="w-full fixed bottom-0 p-4 left-0 bg-white border-t border-border flex flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-2">
        <Tooltip content="Delete Document.">
          <IconButton
            className="bg-ui-button-danger hover:bg-ui-button-danger-hover active:bg-ui-button-danger-pressed"
            isLoading={isBeingDeleted}
            disabled={
              isCancelationLoading || isSubmitLoading || haveBeenDeleted
            }
            onClick={handleDelete}
          >
            <Trash color="white" />
          </IconButton>
        </Tooltip>
        <Button
          isLoading={isCancelationLoading}
          disabled={
            !haveChangesBeenMade ||
            isSubmitLoading ||
            isBeingDeleted ||
            haveBeenDeleted
          }
          onClick={handleCancel}
          variant="secondary"
        >
          Discard Changes
        </Button>
      </div>

      <div className="flex flex-row items-center gap-2">
        <Button
          onClick={hanldeSubmit}
          isLoading={isSubmitLoading}
          disabled={
            !haveChangesBeenMade ||
            isBeingDeleted ||
            isCancelationLoading ||
            haveBeenDeleted
          }
          variant="primary"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default UltimateEntityDocumentControlsBar;
