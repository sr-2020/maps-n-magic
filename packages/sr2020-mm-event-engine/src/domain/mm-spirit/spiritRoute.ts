import Ajv, { JSONSchemaType } from "ajv";

export interface SpiritRoute {
  id: number;
  name: string;
  waypoints: number[];
  waitTimeMinutes: number;
}

const ajv = new Ajv({
  allErrors: true,
  removeAdditional: true,
  // useDefaults: true
});

const defaultSpiritRoute: Omit<SpiritRoute, "id"> = {
  name: '',
  waypoints: [],
  waitTimeMinutes: 5,
};

export const spiritRouteSchema: JSONSchemaType<SpiritRoute> = {
  type: "object",
  properties: {
    id: {type: "integer"},
    name: {type: "string"},
    waypoints: {type: "array", items: {type: "number"}},
    waitTimeMinutes: {type: "integer", minimum: 1},
  },
  required: ["name", "id", "waypoints", "waitTimeMinutes"],
  additionalProperties: false,
}

export const validateSpiritRoute = ajv.compile(spiritRouteSchema);

const newSpiritRouteSchema: JSONSchemaType<Omit<SpiritRoute, "id">> = {
  type: "object",
  properties: {
    name: {type: "string"},
    waypoints: {type: "array", items: {type: "number"}},
    waitTimeMinutes: {type: "integer", minimum: 1},
  },
  required: ["name", "waypoints", "waitTimeMinutes"],
  additionalProperties: false,
}

export const validateNewSpiritRoute = ajv.compile(newSpiritRouteSchema);

export function fillNewSpiritRoute(spiritRoute: Partial<Omit<SpiritRoute, "id">>): Omit<SpiritRoute, "id"> {
  return {
    ...defaultSpiritRoute,
    ...spiritRoute
  };
}
