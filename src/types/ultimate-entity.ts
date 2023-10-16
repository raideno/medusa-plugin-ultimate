import { UltimateEntityTypes } from "./ultimate-entity-types";

export interface UltimateEntity {
  id: string;
  icon?: any;
  name?: string;
  description?: string;
  type?: UltimateEntityTypes;
  /**
   * default to true
   */
  validate?: boolean;
}
