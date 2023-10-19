import React from "react";
import { Select } from "@medusajs/ui";

import { UltimateFieldOption } from "../../../../types/ultimate-entity-field";

import { ControlProps } from ".";

const DEFAULT_SELECT_CONTROL_PLACEHOLDER = "Select an option.";

type HTMLElementType = HTMLSelectElement;

interface SelectControlProps
  extends Omit<
      React.InputHTMLAttributes<HTMLElementType>,
      "value" | "defaultValue" | "onChange"
    >,
    ControlProps<string> {
  options: UltimateFieldOption[];
}

const SelectControl = ({
  value,
  defaultValue,
  onValueChange,
  options,
  ...props
}: SelectControlProps) => {
  function handleValueChange(value: string) {
    onValueChange(value);
  }

  return (
    <Select
      value={value}
      onValueChange={handleValueChange}
      defaultValue={defaultValue}
    >
      <Select.Trigger>
        <Select.Value placeholder={DEFAULT_SELECT_CONTROL_PLACEHOLDER} />
      </Select.Trigger>
      <Select.Content>
        {options.map((option, optionIndex) => {
          return (
            <Select.Item
              value={option.value}
              key={"select-control-item-" + optionIndex}
            >
              {option.label}
            </Select.Item>
          );
        })}
      </Select.Content>
    </Select>
  );
};

export default SelectControl;
