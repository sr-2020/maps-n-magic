import Ajv, { JSONSchemaType } from "ajv";
import type { Request } from 'express';
import { CharacterModelData, GameModel, TokenData, WeakTokenData } from "sr2020-mm-event-engine";
import { CharacterWatcher } from "../characterWatcher";

export type PlayerAuthorizedRequest = Request & {
  userData: TokenData;
  gameModel: GameModel;
  characterModelData: CharacterModelData;
  characterWatcher: CharacterWatcher;
}

export type InnerApiRequest = Request & {
  gameModel: GameModel;
  userData: TokenData;
};

export type MainAuthorizedRequest = Request & {
  userData: WeakTokenData;
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
  id?: number;
}

const tokenRequestBodySchema: JSONSchemaType<TokenRequestBody> = {
  type: "object",
  properties: {
    id: {type: "integer", nullable: true},
    api_key: {type: "string"},
  },
  required: ["api_key"],
  additionalProperties: false,
};

export const validateTokenRequestBody = ajv.compile(tokenRequestBodySchema);

