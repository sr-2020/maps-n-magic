import * as R from 'ramda';

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
const TIDE_LEVEL_UPDATE_INTERVAL = 5000; // millis

export class ManaOceanService extends AbstractService {
  metadata = {
    actions: [
      // 'postManaOceanSettings',
      // 'postManaOceanSettingsConfirmed',
      // 'setManaOceanSettings',
    ],
    requests: [
      // 'manaOceanSettings',
    ],
    emitEvents: [
      // 'postManaOceanSettings',
      // 'postManaOceanSettingsRequested',
      // 'manaOceanSettingsChanged',
    ],
    needActions: ['putLocationRecord'],
    needRequests: ['manaOceanSettings', 'locationRecords'],
    listenEvents: [],
  };

  constructor() {
    super();
    this.prevManaLevel = null;
    this.tideLevelTimerId = null;
    this.onTideLevelUpdate = this.onTideLevelUpdate.bind(this);
    // this.manaOceanSettings = R.clone(defaultManaOceanSettings);
  }

  init(gameModel) {
    super.init(gameModel);
    if (this.tideLevelTimerId === null) {
      this.tideLevelTimerId = setInterval(this.onTideLevelUpdate, TIDE_LEVEL_UPDATE_INTERVAL);
    } else {
      console.error('tideLevelTimer already initialized');
    }
    // this.gameModel = gameModel;
  }

  dispose() {
    if (this.tideLevelTimerId !== null) {
      clearInterval(this.tideLevelTimerId);
    }
  }

  onTideLevelUpdate() {
    const manaOceanSettings = this.getFromModel('manaOceanSettings');
    const locationRecords = this.getFromModel('locationRecords');

    const firstLocation = locationRecords.find(isGeoLocation);

    let { moscowTimeInMinutes, moscowTime } = getMoscowTime();
    // speed up time
    moscowTimeInMinutes = (moscowTime.minute() * 60 + moscowTime.second()) % 1440;
    const tideHeight = getTideHeight2(moscowTimeInMinutes, manaOceanSettings);

    console.log('onTideLevelUpdate', moscowTimeInMinutes, tideHeight, firstLocation, manaOceanSettings);

    this.executeOnModel({
      type: 'putLocationRecord',
      id: firstLocation.id,
      props: {
        options: {
          ...firstLocation.options,
          manaLevel: tideHeight,
        },
      },
    });

    // this.executeOnModel({
    //   type: 'setBackgroundSound',
    //   name: soundName,
    // });
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
