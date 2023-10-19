import { DatePicker } from "@medusajs/ui";

import React, { ChangeEvent } from "react";
import { Input } from "@medusajs/ui";

import { ControlProps } from ".";

// TODO: fix the any
type HTMLElementType = any;

interface DateControlProps
  extends Omit<
      React.InputHTMLAttributes<HTMLElementType>,
      "value" | "defaultValue" | "size" | "onChange"
    >,
    ControlProps<Date> {}

const DateControl = ({
  value,
  defaultValue,
  onValueChange,
  ...props
}: DateControlProps) => {
  function handleValueChange(date: Date) {
    const value = date;
    onValueChange(value);
  }

  return (
    <DatePicker
      className="w-full"
      defaultValue={defaultValue}
      value={value}
      onChange={handleValueChange}
      // {...props}
    />
  );
};

export default DateControl;
