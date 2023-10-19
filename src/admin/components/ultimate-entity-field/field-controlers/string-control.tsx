import React, { ChangeEvent } from "react";
import { Input } from "@medusajs/ui";

import { ControlProps } from ".";

type HTMLElementType = HTMLInputElement;

interface StringControlProps
  extends Omit<
      React.InputHTMLAttributes<HTMLElementType>,
      "value" | "defaultValue" | "size" | "onChange"
    >,
    ControlProps<string> {}

const StringControl = ({
  value,
  defaultValue,
  onValueChange,
  ...props
}: StringControlProps) => {
  function handleValueChange(event: ChangeEvent<HTMLElementType>) {
    const value = event.target.value;
    onValueChange(value);
  }

  return (
    <Input
      size="base"
      className="border border-border"
      value={value}
      defaultValue={defaultValue}
      onChange={handleValueChange}
      {...props}
    />
  );
};

export default StringControl;
