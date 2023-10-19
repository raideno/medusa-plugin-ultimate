import React from "react";
import { ControlProps } from ".";

import MDEditor from "@uiw/react-md-editor";

type HTMLElementType = React.ComponentProps<typeof MDEditor>;

interface MarkdownControlProps
  extends Omit<HTMLElementType, "value" | "defaultValue" | "onChange">,
    ControlProps<string> {}

const MarkdownControl = ({
  value,
  defaultValue,
  onValueChange,
  ...props
}: MarkdownControlProps) => {
  function handleValueChange(
    value: string,
    event?: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    onValueChange(value);
  }

  return (
    <MDEditor
      defaultValue={defaultValue}
      value={value}
      onChange={handleValueChange}
      {...props}
    />
  );
};

export default MarkdownControl;
