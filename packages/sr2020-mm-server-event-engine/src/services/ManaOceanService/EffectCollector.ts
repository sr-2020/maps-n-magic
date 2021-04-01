import * as R from 'ramda';

import { LocationUpdate } from "./types";

import { 
  LocationRecord,
  ManaOceanEffect,
} from 'sr2020-mm-event-engine';

export class EffectCollector {
  index: {
    [locationId: number]: {
      locationRecord: LocationRecord,
      effects: ManaOceanEffect[]
    }
  } = {};

  addEffect(locationRecord: LocationRecord, effect: ManaOceanEffect): void {
    const { id } = locationRecord;
    let record = this.index[id];
    if (record === undefined) {
      record = {
        locationRecord,
        effects: [],
      };
      this.index[id] = record;
    }
    record.effects.push(effect);
  }

  toLocationUpdates(): LocationUpdate[] {
    return R.values(this.index).map(({ locationRecord, effects }) => {
      const { effectList = [] } = locationRecord.options;
      return {
        id: locationRecord.id,
        body: {
          options: {
            ...locationRecord.options,
            effectList: R.concat(effectList, effects),
          },
        },
      };
    });
  }
}