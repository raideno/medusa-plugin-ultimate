import { SketchPicker } from "react-color";
import { InputHTMLAttributes, ChangeEvent, useState } from "react";

import { Badge, Input, Text, useToggleState } from "@medusajs/ui";

import { ControlProps } from "..";

type HTMLElementType = HTMLInputElement;

interface ColorControlProps
  extends Omit<
      InputHTMLAttributes<HTMLElementType>,
      "value" | "defaultValue" | "size" | "onChange"
    >,
    ControlProps<string> {}

const ColorControl = ({
  value,
  defaultValue,
  onValueChange,
  ...props
}: ColorControlProps) => {
  function handleValueChange(color: any) {
    console.log("[color]:", color);
    onValueChange(color.hex);
  }

  const { state, open, close, toggle } = useToggleState();

  return (
    <div className="w-full">
      <div
        onClick={toggle}
        className="cursor-pointer hover:opacity-75 active:opacity-50 w-full h-full border border-border rounded bg-white"
        style={{
          backgroundColor: value,
        }}
      >
        <Text className="inter-base-regular text-grey-50">Click to Edit</Text>
      </div>
      {state && (
        <div className="absolute z-2">
          <div
            className="fixed top-0 right-0 bottom-0 left-0"
            onClick={close}
          />
          <SketchPicker color={value} onChange={handleValueChange} />
        </div>
      )}
    </div>
  );
};

export default ColorControl;
