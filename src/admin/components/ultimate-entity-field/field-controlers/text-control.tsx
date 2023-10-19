import React, { ChangeEvent } from "react";
import { Input, Textarea } from "@medusajs/ui";
import { ControlProps } from ".";

type HTMLElementType = HTMLTextAreaElement;

interface TextControlProps
  extends Omit<
      React.InputHTMLAttributes<HTMLElementType>,
      "value" | "defaultValue" | "onChange"
    >,
    ControlProps<string> {}

const TextControl = ({
  value,
  defaultValue,
  onValueChange,
  ...props
}: TextControlProps) => {
  function handleValueChange(event: ChangeEvent<HTMLElementType>) {
    const value = event.target.value;
    onValueChange(value);
  }

  return (
    <Textarea
      className="border border-border"
      value={value}
      defaultValue={defaultValue}
      onChange={handleValueChange}
      {...props}
    />
  );
};

export default TextControl;
