import { CodeBlock } from "@medusajs/ui";

import { z } from "zod";

import { ControlProps } from "..";
import { UltimateEntityField } from "../../../../../types/ultimate-entity-field";
import Metadata from "./metadata";
import { Button, Text, usePrompt } from "@medusajs/ui";

interface MetadataControlProps
  extends ControlProps<{
    [key: string]: {
      [column: string]: string;
    };
  }> {
  field: UltimateEntityField;
}

const MetadataControl = ({
  value,
  defaultValue,
  onValueChange,
  field,
}: MetadataControlProps) => {
  // in case data is different then null || undefined, before displaying data it have to be validated with zod to check it's integrety
  /**
   * value will be stored like this
   * {
   *    key: {
   *        col-1: string;
   *        col-2: string
   *    }
   * }
   */

  const prompt = usePrompt();

  async function resetMetadata() {
    const confirmation = await prompt({
      title: "Are you sure ?",
      description:
        "Doing this will delete previous metadata data if there is any.",
    });

    if (!confirmation) return;

    onValueChange({});
  }

  if (
    !value ||
    value === null ||
    value === undefined ||
    typeof value !== "object"
  )
    return (
      <div className="p-2 w-full flex flex-col gap-2 rounded border border-ui-border-error">
        <Text className="text-ui-fg-error">
          Schema Error, Invalid Data Type:
        </Text>
        <CodeBlock
          snippets={[
            {
              language: "json",
              label: "Metadata",
              code: JSON.stringify(value, null, 2),
            },
          ]}
        >
          <CodeBlock.Body />
        </CodeBlock>
        <Button className="w-full" variant="danger" onClick={resetMetadata}>
          Fix Schema
        </Button>
      </div>
    );

  return (
    <Metadata
      metadata={value}
      columns={
        field.columns || [
          {
            name: "default-column-name",
            defaultValue: "default-column-value",
            placeholder: "default-column-placeholder",
          },
        ]
      }
      setMetadata={onValueChange}
    />
  );
};

export default MetadataControl;
