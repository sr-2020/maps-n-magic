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

export interface SpiritJarQr {
  workModel: {
    type: 'spirit_jar',
    modelId: string;
    data: {
      spiritId: number | string
    } | {
      emptiness_reason: string
    }
  }
};

const spiritJarQrSchema: JSONSchemaType<SpiritJarQr> = {
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
          oneOf: [{
              type: 'object',
              properties: {
                spiritId: {type: ["string", "number"] }
                // spiritId: { type: 'integer' }
              },
              required: ["spiritId"],
            }, {
              type: 'object',
              properties: {
                'emptiness_reason': { type: 'string' }
              },
              required: ["emptiness_reason"],
            },
          ]
        }
      },
      required: ["type", 'modelId'],
    },
  },
  required: ["workModel"],
};

export const validateSpiritJarQr = ajv.compile(spiritJarQrSchema);