import { partition } from "lodash";

import { UltimateEntityObject } from "../../../../../types/ultimate-entity-object";

const EXCLUDED_KEYS = ["id", "created_at", "updated_at"];

export default async (
  body: any,
  ultimateEntity: UltimateEntityObject
): Promise<{
  errors: { message: string; details: string }[];
  error: boolean;
  relations: string[];
}> => {
  // should receive a body with only allowed keys (relations / relations)
  // return the body relations (separate from relation)

  const fieldsKeys = ultimateEntity.fields.map((field) => field.id);

  const updatableDocumentKeys = ultimateEntity.relations
    .filter((relation) => !EXCLUDED_KEYS.includes(relation.id))
    .map((relation) => relation.id);

  const [notAllowedDocumentKeys, allowedDocumentKeys] = partition(
    Object.keys(body).filter((key) => !fieldsKeys.includes(key)),
    // filter fields keys
    (key) => !updatableDocumentKeys.includes(key)
  );

  if (notAllowedDocumentKeys.length > 0)
    return {
      error: true,
      errors: notAllowedDocumentKeys.map((key) => ({
        message: `invalid relation key: ${key}`,
        details: "error",
      })),
      relations: [],
    };

  return {
    error: false,
    errors: [],
    relations: allowedDocumentKeys,
  };
};
