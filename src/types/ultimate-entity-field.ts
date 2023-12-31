import { UltimateEntityFieldTypes } from "./ultimate-entity-field-types";

export enum UltimateEntityFieldComponents {
  TABLE = "TABLE",
  INPUT = "INPUT",
  TEXT_AREA = "TEXT_AREA",
  SWITCH = "SWITCH",
  CHECBKOX = "CHECBKOX",
  RADIO_GROUP = "RADIO_GROUP",
  SELECT = "SELECT",
  MULTI_SELECT = "MULTI_SELECT",
  IMAGE_INPUT = "IMAGE_INPUT",
  MULTI_STRING_INPUT = "MULTI_STRING_INPUT",
  DATE_INPUT = "DATE_INPUT",
  MARKDOWN_INPUT = "MARKDOWN_INPUT",
  COLOR_INPUT = "COLOR_INPUT",
  NUMBER_INPUT = "NUMBER_INPUT",
}

// TODO: transform components into enum
export type UltimateEntityFieldTypeMap = {
  [UltimateEntityFieldTypes.METADATA]: UltimateEntityFieldComponents.TABLE;
  [UltimateEntityFieldTypes.COLOR]: UltimateEntityFieldComponents.COLOR_INPUT;
  [UltimateEntityFieldTypes.STRING]: UltimateEntityFieldComponents.INPUT;
  [UltimateEntityFieldTypes.TEXT]: UltimateEntityFieldComponents.TEXT_AREA;
  [UltimateEntityFieldTypes.BOOLEAN]:
  | UltimateEntityFieldComponents.SWITCH
  | UltimateEntityFieldComponents.CHECBKOX;
  [UltimateEntityFieldTypes.IMAGE]: UltimateEntityFieldComponents.IMAGE_INPUT;
  [UltimateEntityFieldTypes.UNKNOWN]: UltimateEntityFieldComponents.INPUT;
  [UltimateEntityFieldTypes.SELECT]:
  | UltimateEntityFieldComponents.SELECT
  | UltimateEntityFieldComponents.RADIO_GROUP;
  [UltimateEntityFieldTypes.STRING_ARRAY]: UltimateEntityFieldComponents.MULTI_STRING_INPUT;
  [UltimateEntityFieldTypes.DATE]: UltimateEntityFieldComponents.DATE_INPUT;
  [UltimateEntityFieldTypes.MARKDOWN]: UltimateEntityFieldComponents.MARKDOWN_INPUT;
  [UltimateEntityFieldTypes.NUMBER]: UltimateEntityFieldComponents.NUMBER_INPUT;
};

export type UltimateEntityFieldDefaultValueMap = {
  [UltimateEntityFieldTypes.METADATA]: { [id: string]: string[] };
  [UltimateEntityFieldTypes.STRING]: string;
  [UltimateEntityFieldTypes.TEXT]: string;
  [UltimateEntityFieldTypes.SELECT]: string;
  [UltimateEntityFieldTypes.BOOLEAN]: boolean;
  [UltimateEntityFieldTypes.IMAGE]: string;
  [UltimateEntityFieldTypes.COLOR]: string;
  [UltimateEntityFieldTypes.STRING_ARRAY]: string[];
  [UltimateEntityFieldTypes.DATE]: Date;
  [UltimateEntityFieldTypes.MARKDOWN]: string;
  [UltimateEntityFieldTypes.NUMBER]: number;
  [UltimateEntityFieldTypes.UNKNOWN]: any;
};

export interface UltimateFieldOption {
  value: string;
  label: string;
  description: string;
}

export type UltimateFieldWithType<T extends UltimateEntityFieldTypes> = {
  id: string;
  type: T;
  defaultValue?: UltimateEntityFieldDefaultValueMap[T];
  variant?: UltimateEntityFieldTypeMap[T];
  /**
   * not implemented yet
   */
  note?: string;
  name?: string;
  description?: string;

  group?: string;

  /**
   * only for select components
   * TODO: make options appear as required when using SELECt type and hidden otherwise
   */
  options?: UltimateFieldOption[];

  /**
   * only for metadata / table
   */
  columns?: { name: string; placeholder?: string; defaultValue?: string }[];
};

export type UltimateEntityField =
  | UltimateFieldWithType<UltimateEntityFieldTypes.STRING>
  | UltimateFieldWithType<UltimateEntityFieldTypes.COLOR>
  | UltimateFieldWithType<UltimateEntityFieldTypes.METADATA>
  | UltimateFieldWithType<UltimateEntityFieldTypes.TEXT>
  | UltimateFieldWithType<UltimateEntityFieldTypes.BOOLEAN>
  | UltimateFieldWithType<UltimateEntityFieldTypes.IMAGE>
  | UltimateFieldWithType<UltimateEntityFieldTypes.SELECT>
  | UltimateFieldWithType<UltimateEntityFieldTypes.STRING_ARRAY>
  | UltimateFieldWithType<UltimateEntityFieldTypes.DATE>
  | UltimateFieldWithType<UltimateEntityFieldTypes.MARKDOWN>
  | UltimateFieldWithType<UltimateEntityFieldTypes.NUMBER>
  | UltimateFieldWithType<UltimateEntityFieldTypes.UNKNOWN>;
