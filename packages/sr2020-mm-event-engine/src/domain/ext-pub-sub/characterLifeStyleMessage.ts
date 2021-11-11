import Ajv, { JSONSchemaType } from "ajv";

// {
//   "data": {
//     "skuId": 0,
//     "skuName": "Страховка отсутствует",
//     "lifeStyle": "Страховка отсутствует",
//     "shopName": "Страховка отсутствует",
//     "buyTime": "0001-01-01T00:00:00",
//     "personName": "ТестПер"
//   },
//   "status": true,
//   "message": null
// }

export interface CharacterLifeStyleMessage {
  data: {
    skuId: number;
    skuName: string;
    lifeStyle: string;
    shopName: string;
    buyTime: string;
    personName: string;
  };
  status: boolean;
  message?: string;
}

const ajv = new Ajv({
  allErrors: true,
  // removeAdditional: true,
  // useDefaults: true
});

const characterLifeStyleMessageSchema: JSONSchemaType<CharacterLifeStyleMessage> = {
  type: "object",
  properties: {
    data: {
      type: "object",
      properties: {
        skuId: {type: "integer"},
        skuName: {type: "string"},
        lifeStyle: {type: "string"},
        shopName: {type: "string"},
        buyTime: {type: "string"},
        personName: {type: "string"},
      },
      required: ["skuId", "skuName", "lifeStyle", "shopName", "buyTime", "personName"],
    },
    status: {type: "boolean"},
    message: {type: "string", nullable: true},
    // stateFrom: {type: "string", enum: [
    //   "healthy", "wounded", "clinically_dead", "biologically_dead"
    // ]},
    // stateTo: {type: "string", enum: [
    //   "healthy", "wounded", "clinically_dead", "biologically_dead"
    // ]},
    // timestamp: {type: "integer"}
  },
  required: ["data", "status"],
  // additionalProperties: false,
};

export const validateCharacterLifeStyleMessage = ajv.compile(characterLifeStyleMessageSchema);
