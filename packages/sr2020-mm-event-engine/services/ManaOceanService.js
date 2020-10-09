import * as R from 'ramda';
import shortid from 'shortid';
import moment from 'moment-timezone';
// const shortid = require('shortid');

import { AbstractService } from '../core/AbstractService';

import { getMoscowTime, getTideHeight2 } from '../utils/moonActivityUtils';
import { isGeoLocation } from '../utils';

// const defaultManaOceanSettings = {
//   neutralManaLevel: 3,
//   visibleMoonPeriod: 180, // minutes
//   visibleMoonNewMoonTime: 0,
//   visibleMoonManaTideHeight: 1,
//   invisibleMoonPeriod: 270,
//   invisibleMoonNewMoonTime: 120,
//   invisibleMoonManaTideHeight: 1,
//   moscowTime: 0,
// };
// const TIDE_LEVEL_UPDATE_INTERVAL = 5000; // millis
const TIDE_LEVEL_UPDATE_INTERVAL = 60000 * 10; // millis

let counter = 1;

export class ManaOceanService extends AbstractService {
  metadata = {
    actions: [
      // 'postManaOceanSettings',
      // 'postManaOceanSettingsConfirmed',
    ],
    requests: [
    ],
    emitEvents: [
      // 'postManaOceanSettings',
      // 'postManaOceanSettingsRequested',
    ],
    needActions: ['putLocationRecord', 'putLocationRecords'],
    needRequests: ['manaOceanSettings', 'locationRecords', 'locationRecord', 'enableManaOcean'],
    listenEvents: ['massacreTriggered'],
  };

  constructor() {
    super();
    this.prevTideHeight = null;
    this.tideLevelTimerId = null;
    this.manaModifiers = [];
    this.onTideLevelUpdate = this.onTideLevelUpdate.bind(this);
    this.onMassacreTriggered = this.onMassacreTriggered.bind(this);
    this.getManaOptions = this.getManaOptions.bind(this);
    // this.manaOceanSettings = R.clone(defaultManaOceanSettings);
  }

  init(gameModel) {
    super.init(gameModel);
    if (this.tideLevelTimerId === null) {
      this.tideLevelTimerId = setInterval(this.onTideLevelUpdate, TIDE_LEVEL_UPDATE_INTERVAL);
    } else {
      console.error('tideLevelTimer already initialized');
    }
    this.on('massacreTriggered', this.onMassacreTriggered);
    // this.gameModel = gameModel;
  }

  dispose() {
    if (this.tideLevelTimerId !== null) {
      clearInterval(this.tideLevelTimerId);
    }
    this.off('massacreTriggered', this.onMassacreTriggered);
  }

  onMassacreTriggered(data) {
    const { locationId, timestamp } = data;
    // {
    //   type: 'massacreTriggered',
    //   locationId: 3061,
    //   timestamp: 1602203600686
    // }
    this.manaModifiers.push(data);
    const locationRecord = this.getFromModel({
      type: 'locationRecord',
      id: locationId,
    });
    // console.log('manaModifiers', this.manaModifiers, shortid.generate(), data, locationRecord);
    // const locationRecords = this.getFromModel('locationRecords');
    const { effectList = [] } = locationRecord.options;
    effectList.push({
      type: 'massacre',
      id: shortid.generate(),
      start: timestamp + 60000 * 15, // start after 15 minutes
      end: timestamp + 60000 * 30, // end after 30 minutes
      // start: timestamp + 15000, // start after 15 seconds
      // end: timestamp + 30000, // end after 30 seconds
      manaLevelChange: 1,
    });
    this.executeOnModel({
      type: 'putLocationRecord',
      id: locationRecord.id,
      props: {
        options: {
          ...locationRecord.options,
          effectList,
        },
      },
    });
  }

  onTideLevelUpdate() {
    const enableManaOcean = this.getFromModel('enableManaOcean');
    if (!enableManaOcean) {
      return;
    }
    counter++;
    const curTimestamp = moment.utc().valueOf();

    const manaOceanSettings = this.getFromModel('manaOceanSettings');
    const locationRecords = this.getFromModel('locationRecords');
    const { neutralManaLevel } = manaOceanSettings;

    const geoLocations = locationRecords.filter(isGeoLocation);

    // const geoLocationIndex = R.indexBy(R.prop('id'), geoLocations);

    // const firstLocation = locationRecords.find(isGeoLocation);
    // if (!firstLocation) {
    //   return;
    // }

    let { moscowTimeInMinutes, moscowTime } = getMoscowTime();
    // speed up time, 1 second is 1 minute
    moscowTimeInMinutes = (moscowTime.minute() * 60 + moscowTime.second()) % 1440;
    // const tideHeight = getTideHeight2(moscowTimeInMinutes, manaOceanSettings);

    // if (this.prevTideHeight === tideHeight) {
    //   console.log('Tide height not changed, skip mana level update');
    //   return;
    // }
    let tideHeight = this.prevTideHeight;
    if (counter % 2) {
      tideHeight = this.prevTideHeight === null ? -2 : (this.prevTideHeight === 2 ? -2 : (this.prevTideHeight + 1));
    }

    this.prevTideHeight = tideHeight;

    // console.log('onTideLevelUpdate', 'moscowTimeInMinutes', moscowTimeInMinutes, 'tideHeight', tideHeight, firstLocation);
    console.log('onTideLevelUpdate', 'moscowTimeInMinutes', moscowTimeInMinutes, 'tideHeight', tideHeight);

    const updates = geoLocations.reduce((acc, location) => {
      const newOptions = this.getManaOptions(location, tideHeight, neutralManaLevel, curTimestamp);
      if (!R.isNil(newOptions)) {
        acc.push({
          id: location.id,
          body: {
            options: newOptions,
          },
        });
      }
      return acc;
    }, []);
    console.log('updates.length', updates.length);
    if (updates.length === 0) {
      console.log('no updates for mana ocean');
      return;
    }

    this.executeOnModel({
      type: 'putLocationRecords',
      updates,
    });
    // this.executeOnModel({
    //   type: 'putLocationRecord',
    //   id: firstLocation.id,
    //   props: {
    //     options: {
    //       ...firstLocation.options,
    //       manaLevel: this.calcManaLevel([neutralManaLevel, tideHeight]),
    //       manaLevelModifiers: {
    //         neutralManaLevel,
    //         tideHeight,
    //       },
    //     },
    //   },
    // });
  }

  // eslint-disable-next-line class-methods-use-this
  getManaOptions(location, tideHeight, neutralManaLevel, curTimestamp) {
    const { options } = location;
    const { effectList = [] } = options;
    const liveEffectList = effectList.filter((effect) => effect.end > curTimestamp);
    const effects = liveEffectList.filter((effect) => effect.start < curTimestamp).map((effect) => ({
      type: effect.type,
      manaLevelChange: effect.manaLevelChange,
    }));
    if (effects.length > 0) {
      console.log('effects', location.id, effects);
    }
    const newOptions = {
      manaLevelModifiers: {
        neutralManaLevel,
        tideHeight,
        effects,
      },
      effectList: liveEffectList,
    };
    newOptions.manaLevel = this.calcManaLevel([neutralManaLevel, tideHeight, ...R.pluck('manaLevelChange', effects)]);
    if (!R.equals(options, newOptions)) {
      return newOptions;
    }
    return null;
  }

  calcManaLevel(arr) {
    const sum = R.sum(arr);
    return R.max(R.min(5, sum), 1);
  }
  // getManaOceanSettings() {
  //   return R.clone(this.manaOceanSettings);
  // }

  // setManaOceanSettings({ manaOceanSettings }) {
  //   const areEqual = R.equals(this.manaOceanSettings, manaOceanSettings);
  //   this.setData({ manaOceanSettings });
  //   if (!areEqual) {
  //     this.emit('manaOceanSettingsChanged', {
  //       manaOceanSettings,
  //     });
  //   }
  // }

  // postManaOceanSettings = ({ manaOceanSettings }) => {
  //   this.emit('postManaOceanSettingsRequested', { manaOceanSettings });
  // }

  // postManaOceanSettingsConfirmed({ manaOceanSettings }) {
  //   this.manaOceanSettings = R.clone(manaOceanSettings);
  //   // console.log('postBeaconRecord');
  //   this.emit('postManaOceanSettings', { manaOceanSettings });
  // }
}
