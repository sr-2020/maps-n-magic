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

export interface CatchSpirit2RequestBody {
  spiritJarQrString: string;
  spiritId: number;
}

const catchSpirit2RequestBodySchema: JSONSchemaType<CatchSpirit2RequestBody> = {
  type: "object",
  properties: {
    spiritJarQrString: { type: 'string' },
    spiritId: { type: 'integer' },
  },
  required: ["spiritJarQrString", "spiritId"],
};

export const validateCatchSpirit2RequestBody = ajv.compile(catchSpirit2RequestBodySchema);