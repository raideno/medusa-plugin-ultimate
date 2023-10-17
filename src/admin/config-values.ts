// do verifications that it don't end with a "/" host
export const BACKEND_URL = process.env.MEDUSA_ADMIN_BACKEND_URL;
// do verifications that it don't end with a "/" and it's a valid path
export const ULTIMATE_ENTITIES_BACKEND_PATH = "/admin/ultimate-entities";
// do verifications that it don't end with a "/" and it's a valid path
export const ULTIMATE_ENTITIES_FRONTEND_PATH = "/a/ultimate-entities";
export const ARE_ULTIMATE_ENTITIES_ON_SIDEBAR = true;
export const ULTIMATE_ENTITIES_SIDEBAR_LABEL = "Ultimate Entities";

export const getBackendUltimateEntitiesUrl = () => {};
export const getBackendUltimateEntityUrl = (ultimateEntityId: string) => {};
export const getBackendUltimateEntityDocumentsUrl = (
  ultimateEntityId: string
) => {};
export const getBackendUltimateEntityDocumentUrl = (
  ultimateEntityId: string,
  ultimateEntityDocumentId: string
) => {};
