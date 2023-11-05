import { Badge, Tooltip, clx } from "@medusajs/ui";

import { UltimateEntity } from "../../../types/ultimate-entity";
import { UltimateEntityDocument } from "../../../types/ultimate-entity-document";

import useDocumentName from "../../hooks/use-document-name";

interface UltimateEntityModalSelectOptionProps {
  entity: UltimateEntity;
  document: UltimateEntityDocument;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  status?: {
    isDisabled: boolean;
    type: "grey" | "orange" | "red" | "green";
    text: string;
  };
}

const UltimateEntityModalSelectOption = ({
  document,
  entity,
  className,
  onClick,
  disabled,
  status,
}: UltimateEntityModalSelectOptionProps) => {
  return (
    <Tooltip content={disabled ? "Document Disabled" : "Select this Document"}>
      <div
        onClick={!disabled && onClick}
        className={clx(
          "cursor-pointer w-full p-4 flex flex-row items-center justify-between border border-border rounded",
          disabled && "opacity-25 cursor-not-allowed",
          !disabled && "hover:opacity-75 active:opacity-50",
          className
        )}
      >
        <div>
          <Badge>{useDocumentName(document)}</Badge>
        </div>
        <div>{status && <Badge color={status.type}>{status.text}</Badge>}</div>
      </div>
    </Tooltip>
  );
};

export default UltimateEntityModalSelectOption;
