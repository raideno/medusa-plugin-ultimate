import React, { ChangeEvent } from "react";
import { Checkbox, Input, Select, Switch, Textarea } from "@medusajs/ui";
import { ControlProps } from ".";
// import {
//   // UltimateEntityFieldComponents,
//   // UltimateEntityFieldTypeMap,
//   UltimateFieldOption,
// } from "../../../../../../../types/ultimate-entity-field";
// import { UltimateEntityFieldTypes } from "../../../../../../../types/ultimate-entity-field-types";

export type UltimateEntityFieldTypeMap = {
  [UltimateEntityFieldTypes.STRING]: UltimateEntityFieldComponents.INPUT;
  [UltimateEntityFieldTypes.TEXT]: UltimateEntityFieldComponents.TEXT_AREA;
  [UltimateEntityFieldTypes.BOOLEAN]:
    | UltimateEntityFieldComponents.SWITCH
    | UltimateEntityFieldComponents.CHECBKOX;
  [UltimateEntityFieldTypes.IMAGE]: UltimateEntityFieldComponents.IMAGE_INPUT;
  [UltimateEntityFieldTypes.UNKNOWN]: UltimateEntityFieldComponents.INPUT;
  [UltimateEntityFieldTypes.ONE_TO_MANY_RELATION_SELECT]:
    | UltimateEntityFieldComponents.SELECT
    | UltimateEntityFieldComponents.RADIO_GROUP;
  [UltimateEntityFieldTypes.SELECT]: "select";
};

export enum UltimateEntityFieldComponents {
  INPUT = "INPUT",
  TEXT_AREA = "TEXT_AREA",
  SWITCH = "SWITCH",
  CHECBKOX = "CHECBKOX",
  RADIO_GROUP = "RADIO_GROUP",
  SELECT = "SELECT",
  IMAGE_INPUT = "IMAGE_INPUT",
}

export enum UltimateEntityFieldTypes {
  STRING = "STRING",
  TEXT = "TEXT",
  BOOLEAN = "BOOLEAN",
  IMAGE = "IMAGE",
  SELECT = "SELECT",
  ONE_TO_MANY_RELATION_SELECT = "ONE_TO_MANY_RELATION_SELECT",
  UNKNOWN = "UNKNOWN",
  STRING_ARRAY = "STRING_ARRAY",
  DATE = "DATE",
  MARKDOWN = "MARKDOWN",

  // COLOR_PICKER = "COLOR_PICKER",
  // TIME = "TIME",
  // DATE_AND_TIME = "DATE_AND_TIME",
}

//
const DEFAULT_SELECT_CONTROL_PLACEHOLDER = "Select an option.";

type HTMLElementType = HTMLButtonElement;

interface BooleanControlProps
  extends Omit<
      React.InputHTMLAttributes<HTMLElementType>,
      "value" | "defaultValue" | "onChange"
    >,
    ControlProps<boolean> {
  varaint?: UltimateEntityFieldTypeMap[UltimateEntityFieldTypes.BOOLEAN];
}

const BooleanControl = ({
  value,
  defaultValue,
  onValueChange,
  varaint = UltimateEntityFieldComponents.CHECBKOX,
  ...props
}: BooleanControlProps) => {
  function handleValueChange(value: boolean) {
    onValueChange(value);
  }

  switch (varaint) {
    default:
    case undefined:
    case UltimateEntityFieldComponents.SWITCH:
      return (
        <Switch
          checked={value}
          onCheckedChange={handleValueChange}
          defaultChecked={defaultValue}
          //   {...props}
        />
      );
      break;

    case UltimateEntityFieldComponents.CHECBKOX:
      return (
        <Checkbox
          checked={value}
          onCheckedChange={handleValueChange}
          defaultChecked={defaultValue}
          //   {...props}
        />
      );
      break;
  }
};

export default BooleanControl;
