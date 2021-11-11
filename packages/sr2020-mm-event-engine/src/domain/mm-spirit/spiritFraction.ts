import Ajv, { JSONSchemaType } from "ajv";

export interface SpiritFraction {
  id: number;
  name: string;
  abilities: string[];
}

const ajv = new Ajv({
  allErrors: true,
  removeAdditional: true,
  // useDefaults: true
});

const spiritFractionSchema: JSONSchemaType<SpiritFraction> = {
  type: "object",
  properties: {
    id: {type: "integer"},
    name: {type: "string"},
    abilities: {type:'array', items: {type: 'string'}}
  },
  required: ["name", "id", "abilities"],
  additionalProperties: false,
}

export const validateSpiritFraction = ajv.compile(spiritFractionSchema);