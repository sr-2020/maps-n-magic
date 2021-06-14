import * as ManaOcean from "./manaOcean";

import Ajv, { JSONSchemaType } from "ajv";

const ajv = new Ajv({
  allErrors: true,
  // removeAdditional: true,
  // useDefaults: true
});

// I mix two types of points - usual coordinates and meter coordinates.
// This is two very different types of points.
// Need consider reworking this concept.
// For details see utils: deg2meters and meters2deg
export type SRLatLng = {lat: number, lng: number};

const SRLatLngSchema: JSONSchemaType<SRLatLng> = {
  type: "object",
  properties: {
    lat: {type: "number"},
    lng: {type: "number"},
  },
  required: ["lat", "lng"],
  // additionalProperties: false,
}

export type SRPolygon = {"0": SRLatLng[]};

const SRPolygonSchema: JSONSchemaType<SRPolygon> = {
  type: "object",
  properties: {
    "0": {type: "array", items: SRLatLngSchema },
  },
  required: ["0"],
  // additionalProperties: false,
}

export type SRPolygonOnObject = SRLatLng[][];

const SRPolygonOnObjectSchema: JSONSchemaType<SRPolygonOnObject> = {
  type: "array",
  items: {
    type: "array", items: SRLatLngSchema
  },
  // minItems: 1,
  // maxItems: 1
  // additionalProperties: false,
}

export interface LocationRecord {
  // beacons: [{id: 4, ssid: "EA:93:BA:E7:99:82", bssid: "EA:93:BA:E7:99:82", location_id: 3215,…},…]
  // 0: {id: 4, ssid: "EA:93:BA:E7:99:82", bssid: "EA:93:BA:E7:99:82", location_id: 3215,…}
  // 1: {id: 16, ssid: "C1:22:25:79:BF:01", bssid: "C1:22:25:79:BF:01", location_id: 3215,…}
  // 2: {id: 12, ssid: "FE:7B:B7:53:58:CB", bssid: "FE:7B:B7:53:58:CB", location_id: 3215, label: "Рубикон",…}
  // id: 3215
  id: number;
  // label: "Межрайонье 1"
  label: string;
  // layer_id: 1
  layer_id: number;
  // options: {color: "#3388ff", weight: 3, fillOpacity: 0.2, manaLevel: 6, effectList: []}
    // color: "#3388ff"
    // effectList: []
    // fillOpacity: 0.2
    // manaLevel: 6
    // weight: 3
  options: LocationRecordOptions;
  polygon: SRPolygon;
  // polygon: {,…}
  // 0: [{lat: 54.929353280120615, lng: 36.87302201994499}, {lat: 54.9291853949252, lng: 36.873314380727614},…]
}

export interface LocationRecordOptions {
  color: string;
  weight: number;
  fillOpacity: number;
  manaLevel: number;
  effectList: ManaOcean.ManaOceanEffect[];
};

export type LocPolygonData = Pick<LocationRecord, "id" | "polygon"> & {
  centroid?: SRLatLng
};

export interface LocationUpdate {
  id: number;
  body: Partial<Omit<LocationRecord, 'id'>>
}

const locationRecordOptionsSchema: JSONSchemaType<LocationRecordOptions> = {
  type: "object",
  properties: {
    color: {type: "string", default: '#3388ff'},
    weight: {type: "integer", default: 3},
    fillOpacity: {type: "number", default: 0.2},
    manaLevel: {type: "integer", default: 0},
    effectList: {type: 'array', items: ManaOcean.manaOceanEffectSchema, default: [] },
  },
  required: ["color", "weight", "fillOpacity", "manaLevel", "effectList"],
  // additionalProperties: false,
}

const locationRecordSchema: JSONSchemaType<LocationRecord> = {
  type: "object",
  properties: {
    id: {type: "integer"},
    label: {type: "string"},
    layer_id: {type: "integer"},
    options: locationRecordOptionsSchema,
    polygon: SRPolygonSchema,
  },
  required: ["id", "label", "layer_id", "options", "polygon"],
  // additionalProperties: false,
}

const ajv2 = new Ajv({
  allErrors: true,
  // removeAdditional: true,
  useDefaults: true
});

export const validateLocationRecord = ajv2.compile(locationRecordSchema);

export type LocationRecordForPost = Omit<LocationRecord, "id"> & {
  polygon: SRPolygonOnObject
};

const locationRecordPostSchema: JSONSchemaType<LocationRecordForPost> = {
  type: "object",
  properties: {
    // id: {type: "integer"},
    label: {type: "string"},
    layer_id: {type: "integer"},
    options: locationRecordOptionsSchema,
    polygon: SRPolygonOnObjectSchema,
  },
  required: ["label", "layer_id", "options", "polygon"],
  // additionalProperties: false,
}

export const validateLocationRecordPost = ajv.compile(locationRecordPostSchema);

// const locationRecordPutSchema: JSONSchemaType<Partial<Omit<LocationRecord, "id">>> = {
const locationRecordPutSchema: JSONSchemaType<Partial<Omit<LocationRecordForPost, "id">>> = {
  type: "object",
  properties: {
    // id: {type: "integer"},
    label: {type: "string", nullable: true},
    layer_id: {type: "integer", nullable: true},
    options: {...locationRecordOptionsSchema, nullable: true},
    polygon: {...SRPolygonOnObjectSchema, nullable: true},
    // polygon: {...SRPolygonSchema, nullable: true},
  },
  // required: ["label", "layer_id", "options", "polygon"],
  // additionalProperties: false,
}

export const validateLocationRecordPut = ajv.compile(locationRecordPutSchema);

const locationRecordPutSchema2: JSONSchemaType<Partial<Omit<LocationRecord, "id">>> = {
  type: "object",
  properties: {
    // id: {type: "integer"},
    label: {type: "string", nullable: true},
    layer_id: {type: "integer", nullable: true},
    options: {...locationRecordOptionsSchema, nullable: true},
    // polygon: {...SRPolygonOnObjectSchema, nullable: true},
    polygon: {...SRPolygonSchema, nullable: true},
  },
  // required: ["label", "layer_id", "options", "polygon"],
  // additionalProperties: false,
}

export const validateLocationRecordPut2 = ajv.compile(locationRecordPutSchema2);
