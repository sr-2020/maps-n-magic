import Ajv, { JSONSchemaType } from "ajv";

const ajv = new Ajv({
  allErrors: true,
  // removeAdditional: true,
  // useDefaults: true
});

export interface RawUserRecord {
  // created_at: "2020-05-03 07:58:52"
  // id: 10207
  id: number;
  // location: null
  // location_id: null
  location_id: number | null;
  // location_updated_at: "2020-05-03 07:58:52"
  // name: ""
  // name: string;
  // updated_at: "2020-05-03 07:58:52"
};

export interface UserRecord extends RawUserRecord {
  // created_at: "2020-05-03 07:58:52"
  // id: 10207
  // id: number;
  // location: null
  // location_id: null
  // location_id: number;
  // location_updated_at: "2020-05-03 07:58:52"
  // name: ""
  name: string;
  // updated_at: "2020-05-03 07:58:52"
};

const rawUserRecordSchema: JSONSchemaType<RawUserRecord> = {
  type: "object",
  properties: {
    id: {type: "integer"},
    location_id: {type: "integer", nullable: true},
    // name: {type: "string"},
  },
  required: ["id", "location_id"],
  // additionalProperties: false,
}

export const validateRawUserRecord = ajv.compile(rawUserRecordSchema);