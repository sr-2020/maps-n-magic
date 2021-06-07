import * as R from 'ramda';
import fetch from 'isomorphic-fetch';
import { 
  LifeStylesValues, LifeStyles
} from 'sr2020-mm-event-engine';

import { billingInsurance } from '../constants';

export async function getCharacterLifeStyle(characterId: number): Promise<{
  lifeStyle: LifeStylesValues,
  personName: string,
}> {
  const response = await fetch(`${billingInsurance}?characterid=${characterId}`);

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
