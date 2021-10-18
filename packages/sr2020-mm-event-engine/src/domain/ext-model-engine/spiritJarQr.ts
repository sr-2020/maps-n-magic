import Ajv, { JSONSchemaType } from "ajv";

const ajv = new Ajv({
  allErrors: true,
  // removeAdditional: true,
  // useDefaults: true
});

// "qrModelData": {
//   "baseModel": {
//     "usesLeft": 9999,
//     "type": "spirit_jar",
//     "name": "<name>",
//     "description": "",
//     "modelId": "359",
//     "timestamp": 1624828389380,
//     "modifiers": [],
//     "timers": [],
//     "eventType": "",
//     "data": {
//       "spiritId": "teorh"
//     }
//   },
//   "workModel": {
//     "usesLeft": 9999,
//     "type": "spirit_jar",
//     "name": "<name>",
//     "description": "",
//     "modelId": "359",
//     "timestamp": 1624828389380,
//     "modifiers": [],
//     "timers": [],
//     "eventType": "",
//     "data": {
//       "spiritId": "teorh"
//     }
//   },
//   "notifications": [],
//   "outboundEvents": [],
//   "pubSubNotifications": []
// }

export interface EmptySpiritJarQr {
  workModel: {
    type: 'spirit_jar',
    modelId: string;
    data: {
      emptiness_reason?: string
    }
  }
};

export interface FullSpiritJarQr {
  workModel: {
    type: 'spirit_jar',
    modelId: string;
    data: {
      spiritId: number | string
    }
  }
};

export type SpiritJarQr = EmptySpiritJarQr | FullSpiritJarQr;

const emptySpiritJarQrSchema: JSONSchemaType<EmptySpiritJarQr> = {
  type: "object",
  properties: {
    workModel: {
      type: "object",
      properties: {
        type: {
          type: 'string',
          enum: ['spirit_jar']
        },
        modelId: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            'emptiness_reason': { type: 'string', nullable: true }
          },
          // required: ["emptiness_reason"],
        }
      },
      required: ["type", 'modelId'],
    },
  },
  required: ["workModel"],
};

export const validateEmptySpiritJarQr = ajv.compile(emptySpiritJarQrSchema);

const fullSpiritJarQrSchema: JSONSchemaType<FullSpiritJarQr> = {
  type: "object",
  properties: {
    workModel: {
      type: "object",
      properties: {
        type: {
          type: 'string',
          enum: ['spirit_jar']
        },
        modelId: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            spiritId: {type: ["string", "number"] }
            // spiritId: { type: 'integer' }
          },
          required: ["spiritId"],
        }
      },
      required: ["type", 'modelId'],
    },
  },
  required: ["workModel"],
};

export const validateFullSpiritJarQr = ajv.compile(fullSpiritJarQrSchema);

const spiritJarQrSchema: JSONSchemaType<SpiritJarQr> = {
  anyOf: [
    emptySpiritJarQrSchema,
    fullSpiritJarQrSchema
  ]
};

export const validateSpiritJarQr = ajv.compile(spiritJarQrSchema);

export function isEmptySpiritJar(qr: SpiritJarQr): qr is EmptySpiritJarQr {
  return !('spiritId' in qr.workModel.data);
}

export function isFullSpiritJar(qr: SpiritJarQr): qr is FullSpiritJarQr {
  return 'spiritId' in qr.workModel.data;
}