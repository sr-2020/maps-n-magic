import Ajv, { JSONSchemaType } from "ajv";

const ajv = new Ajv({
  allErrors: true,
  // removeAdditional: true,
  // useDefaults: true
});

export interface BeaconRecord {
  // bssid: "DF:8C:6D:50:E0:16"
  bssid: string;
  // id: 34
  id: number;
  // label: "Нджин"
  label: string;
  // lat: null
  lat: number | null;
  // lng: null
  lng: number | null;
  // location_id: null
  location_id: number | null;
  // ssid: "DF:8C:6D:50:E0:16"
  ssid: string;
}

export interface LatLngBeaconRecord extends BeaconRecord {
  lat: number;
  lng: number;
}

export type BeaconPropChange = 
  { prop: 'bssid', value: string } |
  { prop: 'label', value: string } |
  { prop: 'lat', value: number } |
  { prop: 'lng', value: number } |
  { prop: 'location_id', value: number | null } |
  { prop: 'ssid', value: string };

const beaconRecordSchema: JSONSchemaType<BeaconRecord> = {
  type: "object",
  properties: {
    bssid: {type: "string"},
    id: {type: "integer"},
    label: {type: "string"},
    lat: {type: "number", nullable: true},
    lng: {type: "number", nullable: true},
    location_id: {type: "integer", nullable: true},
    ssid: {type: "string"},
  },
  required: ["bssid", "id", "label", "lat", "lng", "location_id", "ssid"],
  // additionalProperties: false,
}

export const validateBeaconRecord = ajv.compile(beaconRecordSchema);