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

// token for master accounts
export interface WeakTokenData {
  sub: string;
  auth: string;
  exp: number;
}

const weakTokenDataSchema: JSONSchemaType<WeakTokenData> = {
  type: "object",
  properties: {
    sub: {type: "string"},
    auth: {type: "string"},
    exp: {type: "integer"},
  },
  required: ["sub", "auth", "exp"],
  // additionalProperties: false,
};

export const validateWeakTokenData = ajv.compile(weakTokenDataSchema);
