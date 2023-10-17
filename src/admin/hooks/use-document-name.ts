import { startCase } from "lodash";

import { UltimateEntity } from "../../types/ultimate-entity";
import { UltimateEntityModel } from "../../types/ultimate-entity-model";

interface Document extends UltimateEntityModel {
  [key: string]: any;
}

export default (document: Document) => {
  return document.name || document.title || document.id;
};
