import Ajv, { JSONSchemaType } from "ajv";

const ajv = new Ajv({
  allErrors: true,
  // removeAdditional: true,
  // useDefaults: true
});

export interface FreeSpiritRequestBody {
  qrId: number;
  reason: string;
}

const freeSpiritRequestBodySchema: JSONSchemaType<FreeSpiritRequestBody> = {
  type: "object",
  properties: {
    qrId: { type: 'integer' },
    reason: { type: 'string' },
  },
  required: ["qrId", "reason"],
};

export const validateFreeSpiritRequestBody = ajv.compile(freeSpiritRequestBodySchema);

export interface CatchSpiritRequestBody {
  qrId: number;
  spiritId: number;
}

const catchSpiritRequestBodySchema: JSONSchemaType<CatchSpiritRequestBody> = {
  type: "object",
  properties: {
    qrId: { type: 'integer' },
    spiritId: { type: 'integer' },
  },
  required: ["qrId", "spiritId"],
};

export const validateCatchSpiritRequestBody = ajv.compile(catchSpiritRequestBodySchema);