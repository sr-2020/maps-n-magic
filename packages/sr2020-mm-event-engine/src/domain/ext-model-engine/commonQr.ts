import Ajv, { JSONSchemaType } from "ajv";
import { QrType, qrTypeList } from "./qrType";


const ajv = new Ajv({
  allErrors: true,
  // removeAdditional: true,
  // useDefaults: true
});

// in fact this is QrCodeProcessResponse
export interface CommonQr {
  workModel: {
    type: QrType,
  }
}

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