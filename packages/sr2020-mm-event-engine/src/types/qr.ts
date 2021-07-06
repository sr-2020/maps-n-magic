import Ajv, { JSONSchemaType } from "ajv";
import { QrType, qrTypeList } from "./qrType";

export interface CommonQr {
  workModel: {
    type: QrType,
  }
}

const ajv = new Ajv({
  allErrors: true,
  // removeAdditional: true,
  // useDefaults: true
});

const commonQrSchema: JSONSchemaType<CommonQr> = {
  type: "object",
  properties: {
    workModel: {
      type: "object",
      properties: {
        type: {
          type: 'string',
          // enum: ['spirit_jar']
          enum: qrTypeList
        }
      },
      required: ["type"],
    },
  },
  required: ["workModel"],
};

export const validateCommonQr = ajv.compile(commonQrSchema);

// "qrModelData": {
//   "baseModel": {
//     "usesLeft": 9999,
//     "type": "spirit_jar",
//     "name": "Духохранилище",
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
//     "name": "Духохранилище",
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
      emptiness_reason: string
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
            'emptiness_reason': { type: 'string' }
          },
          required: ["emptiness_reason"],
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
  oneOf: [
    emptySpiritJarQrSchema,
    fullSpiritJarQrSchema
  ]
};

export const validateSpiritJarQr = ajv.compile(spiritJarQrSchema);

export function isEmptySpiritJar(qr: SpiritJarQr): qr is EmptySpiritJarQr {
  return 'emptiness_reason' in qr.workModel.data;
}

export function isFullSpiritJar(qr: SpiritJarQr): qr is FullSpiritJarQr {
  return 'spiritId' in qr.workModel.data;
}