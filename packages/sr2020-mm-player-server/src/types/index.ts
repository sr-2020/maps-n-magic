import Ajv, { JSONSchemaType } from "ajv";
import { Request } from 'express';

export type AuthorizedRequest = Request & {
  userData: TokenData;
}

const ajv = new Ajv({
  allErrors: true,
  // removeAdditional: true,
  // useDefaults: true
});


interface AuthRequest {
  username: string;
  password: string;
}

const authRequestSchema: JSONSchemaType<AuthRequest> = {
  type: "object",
  properties: {
    username: {type: "string"},
    password: {type: "string"},
  },
  required: ["username", "password"],
  additionalProperties: false,
};

export const validateAuthRequest = ajv.compile(authRequestSchema);


interface TokenRequestBody {
  api_key: string;
  id: number;
}

const tokenRequestBodySchema: JSONSchemaType<TokenRequestBody> = {
  type: "object",
  properties: {
    id: {type: "integer"},
    api_key: {type: "string"},
  },
  required: ["id", "api_key"],
  additionalProperties: false,
};

export const validateTokenRequestBody = ajv.compile(tokenRequestBodySchema);

interface TokenData {
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
  additionalProperties: false,
};

export const validateTokenData = ajv.compile(tokenDataSchema);