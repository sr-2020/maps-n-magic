import Ajv, { JSONSchemaType } from "ajv";

import { GenericRow } from "./types";

const ajv = new Ajv({
  allErrors: true,
  removeAdditional: true,
  // useDefaults: true
});

const genericRowSchema: JSONSchemaType<GenericRow> = {
  type: "object",
  properties: {
    id: { type: "integer" },
    data: { type: "object", required: [] },
  },
  required: ["data", "id"],
  additionalProperties: false,
}

const genericRowsSchema: JSONSchemaType<GenericRow[]> = {
  type: 'array',
  items: genericRowSchema
};

export const validateGenericRow = ajv.compile(genericRowSchema);

export const validateGenericRows = ajv.compile(genericRowsSchema);
