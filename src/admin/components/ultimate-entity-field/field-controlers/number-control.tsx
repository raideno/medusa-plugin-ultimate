import React, { ChangeEvent } from "react";

import { Input } from "@medusajs/ui";

import { ControlProps } from ".";

type HTMLElementType = HTMLInputElement;

interface NumberControlProps
  extends Omit<
    React.InputHTMLAttributes<HTMLElementType>,
    "value" | "defaultValue" | "size" | "onChange"
  >,
  ControlProps<number> { }

const NumberControl = ({
  value,
  defaultValue,
  onValueChange,
  ...props
}: NumberControlProps) => {
  function handleValueChange(event: ChangeEvent<HTMLElementType>) {
    const value = parseFloat(event.target.value);
    onValueChange(value);
  }

  return (
    <Input
      size="base"
      type="number"
      value={value}
      defaultValue={defaultValue}
      onChange={handleValueChange}
      className="border border-border"
      {...props}
    />
  );
};

export default NumberControl;
