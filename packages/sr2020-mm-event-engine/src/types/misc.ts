import Ajv, { JSONSchemaType } from "ajv";
import { 
  LocationRecord, 
  locationRecordSchema
} from "./locations";

const ajv = new Ajv({
  allErrors: true,
  // removeAdditional: true,
  // useDefaults: true
});

export interface RawUserRecord {
  // created_at: "2020-05-03 07:58:52"
  // created_at: string;
  // id: 10207
  id: number;
  // location: null
  location: LocationRecord | null;
  // location_id: null
  location_id: number | null;
  // location_updated_at: "2020-05-03 07:58:52"
  // location_updated_at: string;
  // name: ""
  // name: string;
  // updated_at: "2020-05-03 07:58:52"
  // updated_at: string;
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
    // created_at: {type: "string"},
    // updated_at: {type: "string"},
    // location_updated_at: {type: "string"},
    // name: {type: "string"},
    location_id: {type: "integer", nullable: true},
    location: {...locationRecordSchema, nullable: true},
  },
  required: [
    "id", 
    "location_id", 
    // "created_at", 
    // "updated_at",
    // "location_updated_at",
    // "name"
  ],
  // additionalProperties: false,
}

export const validateRawUserRecord = ajv.compile(rawUserRecordSchema);