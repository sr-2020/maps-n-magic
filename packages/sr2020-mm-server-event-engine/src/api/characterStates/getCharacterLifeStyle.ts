import * as R from 'ramda';
import fetch from 'isomorphic-fetch';
import { 
  LifeStylesValues, LifeStyles, validateCharacterLifeStyleMessage
} from 'sr2020-mm-event-engine';

import { mainServerConstants } from '../constants';
import { createLogger } from '../../utils';

const logger = createLogger('getCharacterLifeStyle.ts');


const unknownLifeStyle = {
  lifeStyle: LifeStyles.Unknown,
  personName: 'N/A',
};

export async function getCharacterLifeStyle(characterId: number): Promise<{
  lifeStyle: LifeStylesValues,
  personName: string,
}> {
  try {
    const response = await fetch(`${mainServerConstants().billingInsurance}?characterid=${characterId}`);
  
    if (!response.ok) {
      try {
        const text = await response.text();
        // throw new Error(`getCharacterLifeStyle network response was not ok ${text}`);
        throw new Error(`getCharacterLifeStyle network response was not ok ${response.ok} ${response.statusText}`);
      } catch (err) {
        logger.error(err);
      }
      return unknownLifeStyle;
    }
  
    const result = await response.json();
  
    if (!validateCharacterLifeStyleMessage(result)) {
      logger.error(`Received invalid getCharacterLifeStyle. ${JSON.stringify(result)} ${JSON.stringify(validateCharacterLifeStyleMessage.errors)}`);
    } else {
      // logger.info('getCharacterLifeStyle validation OK');
    }
    // logger.info('getCharacterLifeStyle ' + JSON.stringify(result));
  
    if (result.status) {
      return {
        lifeStyle: result.data.lifeStyle,
        personName: result.data.personName,
      };
    }
  } catch (err) {
    logger.error(err);
  }
  return unknownLifeStyle;
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
