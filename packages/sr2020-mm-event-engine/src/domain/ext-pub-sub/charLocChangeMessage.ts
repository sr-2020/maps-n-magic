import Ajv, { JSONSchemaType } from "ajv";

export interface CharLocChangeMessage {
  id: number;
  locationId: number | null;
  prevLocationId: number | null;
  timestamp: number;
}

const ajv = new Ajv({
  allErrors: true,
  // removeAdditional: true,
  // useDefaults: true
});

// {
//   "id": 51935,
//   "locationId": 3212,
//   "prevLocationId": 3217,
//   "timestamp": 1606094156924
// }

const charLocChangeMessageSchema: JSONSchemaType<CharLocChangeMessage> = {
  type: "object",
  properties: {
    id: {type: "integer"},
    locationId: {type: "integer", nullable: true},
    prevLocationId: {type: "integer", nullable: true},
    timestamp: {type: "integer"}
  },
  required: ["id", "locationId", "prevLocationId", "timestamp"],
  // additionalProperties: false,
};

export const validateCharLocChangeMessage = ajv.compile(charLocChangeMessageSchema);
