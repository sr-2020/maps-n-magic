import * as R from 'ramda';
import fetch from 'isomorphic-fetch';

import { billingInsurance } from '../constants';

export async function getCharacterLifeStyle(characterId) {
  const response = await fetch(`${billingInsurance}?characterid=${characterId}`);

  if (!response.ok) {
    try {
      const text = await response.text();
      throw new Error(`Network response was not ok ${text}`);
    } catch (err) {
      console.error(err);
    }
    return {
      lifeStyle: 'Unknown',
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
    lifeStyle: 'Unknown',
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
