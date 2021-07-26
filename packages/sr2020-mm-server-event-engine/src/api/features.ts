import fetch from 'isomorphic-fetch';

import { createLogger } from "../utils";

import { 
  Feature,
  validateFeatureArr,
  validateFeature
} from 'sr2020-mm-event-engine';

import {  
  Gettable2, SingleGettable2,
} from "./types";
import { mainServerConstants } from "./constants";

const logger = createLogger('features.ts');

export class FeatureProvider implements Gettable2<Feature>, SingleGettable2<Feature>
{
  singleGet(id: string | number): Promise<unknown> {
    throw new Error('Method not implemented.');
  }
  async get(): Promise<Feature[]>  {
    const response = await fetch(mainServerConstants().featuresUrl);
    if (!response.ok) {
      const text = await response.text();
      // logger.info(response);
      throw new Error(`Network response was not ok ${text}`);
    }

    const result: unknown = await response.json();
    if (!validateFeatureArr(result)) {
      (result as Feature[]).forEach(feature => {
        if(!validateFeature(feature)) {
          logger.info('errors during feature validation', validateFeature.errors);
        }
      });
      // logger.info('errors during features validation', validateFeatureArr.errors);
      return result as Feature[];
    }
    logger.info('no errors during features validation');

    return result;
  }

  validateEntity = validateFeature;
}