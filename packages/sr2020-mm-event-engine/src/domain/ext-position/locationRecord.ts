import Ajv, { JSONSchemaType } from "ajv";
import { 
  ManaOceanEffect,
  manaOceanEffectSchema 
} from "../mm-mana-ocean";
import { 
  SRLatLng, 
  SRPolygon, 
  SRPolygonOnObject, 
  SRPolygonOnObjectSchema, 
  SRPolygonSchema 
} from "../shared-kernel";

const ajv = new Ajv({
  allErrors: true,
  // removeAdditional: true,
  // useDefaults: true
});

export interface LocationRecord {
  // beacons: [{id: 4, ssid: "EA:93:BA:E7:99:82", bssid: "EA:93:BA:E7:99:82", location_id: 3215,…},…]
  // 0: {id: 4, ssid: "EA:93:BA:E7:99:82", bssid: "EA:93:BA:E7:99:82", location_id: 3215,…}
  // 1: {id: 16, ssid: "C1:22:25:79:BF:01", bssid: "C1:22:25:79:BF:01", location_id: 3215,…}
  // 2: {id: 12, ssid: "FE:7B:B7:53:58:CB", bssid: "FE:7B:B7:53:58:CB", location_id: 3215, label: "<label>",…}
  // id: 3215
  id: number;
  // label: "<label>"
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
  color?: string;
  weight?: number;
  fillOpacity?: number;
  manaLevel?: number;
  effectList?: ManaOceanEffect[];
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
    color: {type: "string", default: '#3388ff', nullable: true},
    weight: {type: "integer", default: 3, nullable: true},
    fillOpacity: {type: "number", default: 0.2, nullable: true},
    manaLevel: {type: "integer", default: 0, nullable: true},
    effectList: {type: 'array', items: manaOceanEffectSchema, default: [], nullable: true },
  },
  // required: ["manaLevel", "effectList"],
  // additionalProperties: false,
}

export const locationRecordSchema: JSONSchemaType<LocationRecord> = {
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



export const defaultLocationStyleOptions: LocationRecordOptions = {
  color: '#3388ff',
  weight: 3,
  fillOpacity: 0.2,
  manaLevel: 4,
  effectList: []
};

export const defaultLocationRecord: Omit<LocationRecord, 'id'> = {
  label: '',
  // created_at: null,
  // updated_at: null,
  polygon: [[]],
  options: {
    ...defaultLocationStyleOptions,
  },
  layer_id: 1,
};