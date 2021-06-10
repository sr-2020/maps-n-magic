import Ajv, { JSONSchemaType } from "ajv";

const ajv = new Ajv({
  allErrors: true,
  // removeAdditional: true,
  // useDefaults: true
});

export interface UserRecord {
  // created_at: "2020-05-03 07:58:52"
  // id: 10207
  id: number;
  // location: null
  // location_id: null
  location_id: number;
  // location_updated_at: "2020-05-03 07:58:52"
  // name: ""
  name: string;
  // updated_at: "2020-05-03 07:58:52"
};

const userRecordSchema: JSONSchemaType<UserRecord> = {
  type: "object",
  properties: {
    id: {type: "integer"},
    location_id: {type: "integer"},
    name: {type: "string"},
  },
  required: ["name", "id", "location_id"],
  // additionalProperties: false,
}

export const validateUserRecord = ajv.compile(userRecordSchema);