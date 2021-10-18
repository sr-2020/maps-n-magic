import Ajv, { JSONSchemaType } from "ajv";

export interface PlayerMessage {
  id: string; // time
  characterId: number;
  messageBody: string;
  spiritId: number;
  spiritFractionId: number;
}

const ajv = new Ajv({
  allErrors: true,
  removeAdditional: true,
  // useDefaults: true
});

const playerMessageSchema: JSONSchemaType<PlayerMessage> = {
  type: "object",
  properties: {
    id: {type: "string"},
    characterId: {type: "integer"},
    spiritFractionId: {type: "integer"},
    spiritId: {type: "integer"},
    messageBody: {type: "string"},
  },
  required: [ "id", "characterId", 'messageBody', 'spiritFractionId', 'spiritId'],
  additionalProperties: false,
}

export const validatePlayerMessage = ajv.compile(playerMessageSchema);