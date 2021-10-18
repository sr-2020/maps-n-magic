import Ajv, { JSONSchemaType } from "ajv";

const ajv = new Ajv({
  allErrors: true,
  // removeAdditional: true,
  // useDefaults: true
});

export interface EmptyBodyStorageQr {
  workModel: {
    type: 'body_storage',
    modelId: string;
    data: {}
  }
};

export interface FullBodyStorageQr {
  workModel: {
    type: 'body_storage',
    modelId: string;
    data: {
      body: {
        characterId: string;
      }
    }
  }
};

export type BodyStorageQr = EmptyBodyStorageQr | FullBodyStorageQr;

const emptyBodyStorageQrSchema: JSONSchemaType<EmptyBodyStorageQr> = {
  type: "object",
  properties: {
    workModel: {
      type: "object",
      properties: {
        type: {
          type: 'string',
          enum: ['body_storage']
        },
        modelId: { type: 'string' },
        data: {
          type: 'object',
          additionalProperties: false
        }
      },
      required: ["type", 'modelId'],
    },
  },
  required: ["workModel"],
};

export const validateEmptyBodyStorageQr = ajv.compile(emptyBodyStorageQrSchema);


const fullBodyStorageQrSchema: JSONSchemaType<FullBodyStorageQr> = {
  type: "object",
  properties: {
    workModel: {
      type: "object",
      properties: {
        type: {
          type: 'string',
          enum: ['body_storage']
        },
        modelId: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            body: {
              type: 'object',
              properties: {
                characterId: {type: 'string'}
              },
              required: ["characterId"],
            }
          },
          required: ["body"],
        }
      },
      required: ["type", 'modelId'],
    },
  },
  required: ["workModel"],
};

export const validateFullBodyStorageQr = ajv.compile(fullBodyStorageQrSchema);

const bodyStorageQrSchema: JSONSchemaType<BodyStorageQr> = {
  anyOf: [
    emptyBodyStorageQrSchema,
    fullBodyStorageQrSchema
  ]
};

export const validateBodyStorageQr = ajv.compile(bodyStorageQrSchema);

export function isEmptyBodyStorage(qr: BodyStorageQr): qr is EmptyBodyStorageQr {
  return !('body' in qr.workModel.data);
}

export function isFullBodyStorage(qr: BodyStorageQr): qr is FullBodyStorageQr {
  return 'body' in qr.workModel.data;
}