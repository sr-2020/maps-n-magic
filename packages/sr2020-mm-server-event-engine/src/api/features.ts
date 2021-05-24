import fetch from 'isomorphic-fetch';

import { 
  Feature,
  validateFeatureArr,
  validateFeature
} from 'sr2020-mm-event-engine';

import {  
  Gettable2,
} from "./types";
import { featuresUrl } from "./constants";

export class FeatureProvider implements Gettable2<Feature>
{
  async get(): Promise<Feature[]>  {
    const response = await fetch(featuresUrl);
    if (!response.ok) {
      const text = await response.text();
      // console.log(response);
      throw new Error(`Network response was not ok ${text}`);
    }

    const result: unknown = await response.json();
    if (!validateFeatureArr(result)) {
      (result as Feature[]).forEach(feature => {
        if(!validateFeature(feature)) {
          console.log('errors during feature validation', validateFeature.errors);
        }
      });
      // console.log('errors during features validation', validateFeatureArr.errors);
      return result as Feature[];
    }
    console.log('no errors during features validation');

    return result;
  }
}