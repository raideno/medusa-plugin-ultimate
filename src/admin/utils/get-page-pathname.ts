import { ULTIMATE_ENTITIES_FRONTEND_PATH } from "../config-values";

export default {
  entities: () => `${ULTIMATE_ENTITIES_FRONTEND_PATH}`,
  entityDocuments: (entityId: string) =>
    `${ULTIMATE_ENTITIES_FRONTEND_PATH}/${entityId}`,
  entityDocument: (entityId: string, documentId: string) =>
    `${ULTIMATE_ENTITIES_FRONTEND_PATH}/${entityId}/${documentId}`,
};
