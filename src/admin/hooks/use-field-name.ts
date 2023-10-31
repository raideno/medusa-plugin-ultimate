import { startCase } from "lodash";

import { UltimateEntityField } from "../../types/ultimate-entity-field";

export default (field: UltimateEntityField) => {
  return field.name || startCase(field.id);
};
