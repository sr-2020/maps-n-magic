import * as R from 'ramda';
import fetch from 'isomorphic-fetch';
import Ajv, { JSONSchemaType } from "ajv";
import { 
  LifeStylesValues, LifeStyles
} from 'sr2020-mm-event-engine';

import { mainServerConstants } from '../constants';

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

interface CharacterLifeStyleMessage {
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

export async function getCharacterLifeStyle(characterId: number): Promise<{
  lifeStyle: LifeStylesValues,
  personName: string,
}> {
  const response = await fetch(`${mainServerConstants().billingInsurance}?characterid=${characterId}`);

  if (!response.ok) {
    try {
      const text = await response.text();
      // throw new Error(`getCharacterLifeStyle network response was not ok ${text}`);
      throw new Error(`getCharacterLifeStyle network response was not ok ${response.ok} ${response.statusText}`);
    } catch (err) {
      console.error(err);
    }
    return {
      lifeStyle: LifeStyles.Unknown,
      personName: 'N/A',
    };
  }

  const result = await response.json();

  if (!validateCharacterLifeStyleMessage(result)) {
    console.error(`Received invalid getCharacterLifeStyle. ${JSON.stringify(result)} ${JSON.stringify(validateCharacterLifeStyleMessage.errors)}`);
  } else {
    console.log('getCharacterLifeStyle validation OK');
  }
  // console.log('getCharacterLifeStyle ' + JSON.stringify(result));

  if (result.status) {
    return {
      lifeStyle: result.data.lifeStyle,
      personName: result.data.personName,
    };
  }
  return {
    lifeStyle: LifeStyles.Unknown,
    personName: 'N/A',
  };
}

// request example
// GET https://billing.evarun.ru/insurance/getinsurance?characterid=10198

// on success
// {
//   "data": {
//     "skuId": 0,
//     "skuName": "Страховка отсутствует",
//     "lifeStyle": "Wood",
//     "shopName": "Страховка отсутствует",
//     "buyTime": "0001-01-01T00:00:00",
//     "personName": "Алексей Ерёмин в группе Мастера и приложение"
//   },
//   "status": true,
//   "message": null
// }

// on fail
// {
//   "data": null,
//   "status": false,
//   "message": "character 10 not found"
// }
