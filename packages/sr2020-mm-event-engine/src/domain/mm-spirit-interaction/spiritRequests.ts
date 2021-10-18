import Ajv, { JSONSchemaType } from "ajv";

const ajv = new Ajv({
  allErrors: true,
  // removeAdditional: true,
  // useDefaults: true
});

export interface FreeSpiritRequestBody {
  qrId: number;
  reason: string;
  messageBody: string;
}

const freeSpiritRequestBodySchema: JSONSchemaType<FreeSpiritRequestBody> = {
  type: "object",
  properties: {
    qrId: { type: 'integer' },
    reason: { type: 'string' },
    messageBody: { type: 'string' },
  },
  required: ["qrId", "reason", "messageBody"],
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

export interface SuitSpiritRequestBody {
  bodyStorageQrString: string;
  spiritJarQrString: string;
}

const suitSpiritRequestBodySchema: JSONSchemaType<SuitSpiritRequestBody> = {
  type: "object",
  properties: {
    spiritJarQrString: { type: 'string' },
    bodyStorageQrString: { type: 'string' },
  },
  required: ["spiritJarQrString", "bodyStorageQrString"],
};

export const validateSuitSpiritRequestBody = ajv.compile(suitSpiritRequestBodySchema);

export interface DispiritRequestBody {
  bodyStorageQrString: string;
  spiritJarQrString: string | null;
  messageBody: string;
}

const dispiritRequestBodySchema: JSONSchemaType<DispiritRequestBody> = {
  type: "object",
  properties: {
    bodyStorageQrString: { type: 'string' },
    spiritJarQrString: { type: 'string', nullable: true },
    messageBody: { type: 'string' },
  },
  required: ["bodyStorageQrString", "spiritJarQrString", "messageBody"],
};

export const validateDispiritRequestBody = ajv.compile(dispiritRequestBodySchema);
