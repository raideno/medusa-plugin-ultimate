import { UltimateEntityFieldTypes } from "./ultimate-entity-field-types";

// interface UltimateEntityField<T extends UltimateEntityFieldTypes> {
//   type: T;
//   defaultValue: any;
//   /**will depend on te type, if the type is "string" you'll be able to put input, if it's boolean you'll be able to choose between switch and checkbox */
//   varaint: VariantMap[T];
// }

export enum UltimateEntityFieldComponents {
  INPUT,
  TEXT_AREA,
  SWITCH,
  CHECBKOX,
  RADIO_GROUP,
  SELECT,
  IMAGE_INPUT,
}

// TODO: transform components into enum
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

export type UltimateEntityFieldDefaultValueMap = {
  [UltimateEntityFieldTypes.STRING]: string;
  [UltimateEntityFieldTypes.TEXT]: string;
  [UltimateEntityFieldTypes.ONE_TO_MANY_RELATION_SELECT]: string;
  [UltimateEntityFieldTypes.SELECT]: string;
  [UltimateEntityFieldTypes.BOOLEAN]: boolean;
  [UltimateEntityFieldTypes.IMAGE]: string;
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
  note?: string;
  name?: string;
  description?: string;
  options?: UltimateFieldOption[];
  /**
   * default to true
   */
  editable?: boolean;
  /**
   * default to true
   */
  validate?: boolean;
};

export type UltimateEntityField =
  | UltimateFieldWithType<UltimateEntityFieldTypes.STRING>
  | UltimateFieldWithType<UltimateEntityFieldTypes.TEXT>
  | UltimateFieldWithType<UltimateEntityFieldTypes.BOOLEAN>
  | UltimateFieldWithType<UltimateEntityFieldTypes.IMAGE>
  | UltimateFieldWithType<UltimateEntityFieldTypes.ONE_TO_MANY_RELATION_SELECT>
  | UltimateFieldWithType<UltimateEntityFieldTypes.SELECT>
  | UltimateFieldWithType<UltimateEntityFieldTypes.UNKNOWN>;
