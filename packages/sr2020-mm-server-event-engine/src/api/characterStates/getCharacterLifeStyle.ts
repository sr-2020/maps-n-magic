import * as R from 'ramda';
import fetch from 'isomorphic-fetch';
import { 
  validateCharacterLifeStyleMessage,
  CharacterLifeStyle,
  unknownLifeStyle
} from 'sr2020-mm-event-engine';

import { mainServerConstants } from '../constants';
import { createLogger } from '../../utils';
import { SingleGettable2 } from '../types';

const logger = createLogger('getCharacterLifeStyle.ts');

export class LifeStyleProvider implements SingleGettable2<CharacterLifeStyle> {
  validateEntity = (entity: any): entity is CharacterLifeStyle => true;

  async singleGet(characterId: number): Promise<CharacterLifeStyle> {
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
        return {
          ...unknownLifeStyle,
          id: characterId
        };
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
          id: characterId,
          lifeStyle: result.data.lifeStyle,
          personName: result.data.personName,
        };
      }
    } catch (err) {
      logger.error(err);
    }
    return {
      ...unknownLifeStyle,
      id: characterId
    };
  }
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
