import { startCase } from "lodash";

import { UltimateEntity } from "../../types/ultimate-entity";
import { UltimateEntityDocument } from "../../types/ultimate-entity-document";

interface Document extends UltimateEntityDocument {
  [key: string]: any;
}

export default (document: Document) => {
  return document.name || document.title || document.id;
};
