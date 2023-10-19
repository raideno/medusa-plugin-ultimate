import { partition } from "lodash";

import { UltimateEntityObject } from "../../../../../types/ultimate-entity-object";

const EXCLUDED_KEYS = ["id", "created_at", "updated_at"];

export default async (
  body: any,
  ultimateEntity: UltimateEntityObject
): Promise<{
  errors: { message: string; details: string }[];
  error: boolean;
  fields: string[];
}> => {
  // should receive a body with only allowed keys (fields / relations)
  // return the body fields (separate from relation)

  const relationKeys = ultimateEntity.relations.map((relation) => relation.id);

  const updatableDocumentKeys = ultimateEntity.fields
    .filter((field) => !EXCLUDED_KEYS.includes(field.id))
    .map((field) => field.id);

  const [notAllowedDocumentKeys, allowedDocumentKeys] = partition(
    Object.keys(body).filter((key) => !relationKeys.includes(key)),
    // filter the relation fields from the body
    (key) => !updatableDocumentKeys.includes(key)
  );

  if (notAllowedDocumentKeys.length > 0)
    return {
      error: true,
      errors: notAllowedDocumentKeys.map((key) => ({
        message: `invalid field key: ${key}`,
        details: "error",
      })),
      fields: [],
    };

  return {
    error: false,
    errors: [],
    fields: allowedDocumentKeys,
  };
};
