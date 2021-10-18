import { JSONSchemaType } from "ajv";

// I mix two types of points - usual coordinates and meter coordinates.
// This is two very different types of points.
// Need consider reworking this concept.
// For details see utils: deg2meters and meters2deg
export type SRLatLng = {lat: number, lng: number};

export const SRLatLngSchema: JSONSchemaType<SRLatLng> = {
  type: "object",
  properties: {
    lat: {type: "number"},
    lng: {type: "number"},
  },
  required: ["lat", "lng"],
  // additionalProperties: false,
}

export type SRPolygon = {"0": SRLatLng[]};

export const SRPolygonSchema: JSONSchemaType<SRPolygon> = {
  type: "object",
  properties: {
    "0": {type: "array", items: SRLatLngSchema },
  },
  required: ["0"],
  // additionalProperties: false,
}

export type SRPolygonOnObject = SRLatLng[][];

export const SRPolygonOnObjectSchema: JSONSchemaType<SRPolygonOnObject> = {
  type: "array",
  items: {
    type: "array", items: SRLatLngSchema
  },
  // minItems: 1,
  // maxItems: 1
  // additionalProperties: false,
}

