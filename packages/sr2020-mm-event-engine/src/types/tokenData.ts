import Ajv, { JSONSchemaType } from "ajv";

const ajv = new Ajv({
  allErrors: true,
  // removeAdditional: true,
  // useDefaults: true
});

export interface TokenData {
  sub: string;
  auth: string;
  modelId: number;
  characterId: number;
  exp: number;
}

const tokenDataSchema: JSONSchemaType<TokenData> = {
  type: "object",
  properties: {
    sub: {type: "string"},
    auth: {type: "string"},
    modelId: {type: "integer"},
    characterId: {type: "integer"},
    exp: {type: "integer"},
  },
  required: ["sub", "auth", "modelId", "characterId", "exp"],
  // additionalProperties: false,
};

export const validateTokenData = ajv.compile(tokenDataSchema);