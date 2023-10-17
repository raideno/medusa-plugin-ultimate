import { startCase } from "lodash";

import { UltimateEntity } from "../../types/ultimate-entity";

export default (entity: UltimateEntity) => {
  return entity.name || startCase(entity.id);
};
