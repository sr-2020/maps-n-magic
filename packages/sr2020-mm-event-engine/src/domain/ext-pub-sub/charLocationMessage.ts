import Ajv, { JSONSchemaType } from "ajv";

export type CharLocationMessage = {
  id: number,
  locationId: number,
  prevLocationId: number
}

const ajv = new Ajv({
  allErrors: true,
  // removeAdditional: true,
  // useDefaults: true
});

const charLocationMessageSchema: JSONSchemaType<CharLocationMessage> = {
  type: "object",
  properties: {
    id: {type: "integer"},
    locationId: {type: "integer"},
    prevLocationId: {type: "integer"},
  },
  required: ["id", "locationId", "prevLocationId"],
  // additionalProperties: false,
};

export const validateCharLocationMessage = ajv.compile(charLocationMessageSchema);
