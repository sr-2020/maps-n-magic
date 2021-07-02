import Ajv, { JSONSchemaType } from "ajv";
import type { Request } from 'express';
import { TokenData } from "sr2020-mm-event-engine";

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

