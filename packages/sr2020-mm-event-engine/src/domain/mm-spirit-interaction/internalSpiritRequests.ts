import Ajv, { JSONSchemaType } from "ajv";

const ajv = new Ajv({
  allErrors: true,
});

export interface SuitSpiritInternalRequest {
  characterId: number;
  spiritJarId: number;
  bodyStorageId: number;
  suitDuration: number;
}

const suitSpiritInternalRequestSchema: JSONSchemaType<SuitSpiritInternalRequest> = {
  type: "object",
  properties: {
    characterId: { type: 'number' },
    spiritJarId: { type: 'number' },
    bodyStorageId: { type: 'number' },
    suitDuration: { type: 'number' },
  },
  required: ["characterId", "spiritJarId", "bodyStorageId", "suitDuration"],
};

export const validateSuitSpiritInternalRequest = ajv.compile(suitSpiritInternalRequestSchema);

export interface DispiritInternalRequest {
  characterId: number;
  spiritJarId: number | null;
  bodyStorageId: number;
  messageBody: string;
}

const dispiritInternalRequestSchema: JSONSchemaType<DispiritInternalRequest> = {
  type: "object",
  properties: {
    characterId: { type: 'number' },
    spiritJarId: { type: 'number', nullable: true },
    bodyStorageId: { type: 'number' },
    messageBody: { type: 'string' },
  },
  required: ["characterId", "spiritJarId", "bodyStorageId", "messageBody"],
};

export const validateDispiritInternalRequest = ajv.compile(dispiritInternalRequestSchema);


export interface CatchSpiritInternalRequest {
  qrId: number;
  spiritId: number;
  characterId: number;
}

const catchSpiritInternalRequestSchema: JSONSchemaType<CatchSpiritInternalRequest> = {
  type: "object",
  properties: {
    qrId: {
      type: "number",
    },
    spiritId: {
      type: "number",
    },
    characterId: {
      type: "number",
    },
  },
  required: ["qrId", "spiritId", "characterId"],
  additionalProperties: false
};

export const validateCatchSpiritInternalRequest = ajv.compile(catchSpiritInternalRequestSchema);

export interface FreeSpiritInternalRequest {
  qrId: number;
  reason: string;
  characterId: number;
  messageBody: string;
}

const freeSpiritInternalRequestSchema: JSONSchemaType<FreeSpiritInternalRequest> = {
  type: "object",
  properties: {
    qrId: {
      type: "number",
    },
    reason: {
      type: "string",
    },
    characterId: {
      type: "number",
    },
    messageBody: {
      type: "string",
    },
  },
  required: ["qrId", "reason", "characterId", "messageBody"],
  additionalProperties: false
};

export const validateFreeSpiritInternalRequest = ajv.compile(freeSpiritInternalRequestSchema);



export interface PutSpiritInJarRequestBody {
  spiritType: "mr-cellophane" | "fireball-keeper" | "tick-a-lick-a-boo";
  qrId: number; // qrId пустого духохранилища
}

const putSpiritInJarRequestBodySchema: JSONSchemaType<PutSpiritInJarRequestBody> = {
  type: "object",
  properties: {
    qrId: {
      type: "number",
    },
    spiritType: {
      type: "string",
      enum: ['fireball-keeper', 'mr-cellophane', 'tick-a-lick-a-boo']
    },
  },
  required: ["qrId", "spiritType"],
  additionalProperties: false
};

export const validatePutSpiritInJarRequestBody = ajv.compile(putSpiritInJarRequestBodySchema);
