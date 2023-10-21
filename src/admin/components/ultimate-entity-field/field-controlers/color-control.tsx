import { SketchPicker } from "react-color";
import { InputHTMLAttributes } from "react";

import { Text, useToggleState } from "@medusajs/ui";

import { ControlProps } from ".";

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
    try {
      if (color) onValueChange(color.hex);
    } catch {
      // TODO: add error prevention
    }
  }

  const { state, open, close, toggle } = useToggleState();

  return (
    <div className="w-full">
      <div
        onClick={toggle}
        className="cursor-pointer bg-white p-2 hover:opacity-75 active:opacity-50 w-full h-full border border-border rounded bg-white"
      >
        <div
          className="flex flex-row items-center justify-center w-full h-10 rounded border border-border"
          style={{
            backgroundColor: value,
          }}
        >
          {(!value || value === null || value === undefined) && (
            <Text className="font-normal font-sans txt-medium text-grey-50">
              Select a color.
            </Text>
          )}
        </div>
      </div>
      {state && (
        <div className="absolute z-10">
          <div
            className="fixed top-0 right-0 bottom-0 left-0"
            onClick={close}
          />
          <SketchPicker
            color={value || "#FFFFFF"}
            onChange={handleValueChange}
          />
        </div>
      )}
    </div>
  );
};

export default ColorControl;
