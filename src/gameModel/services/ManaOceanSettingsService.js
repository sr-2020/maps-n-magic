import * as R from 'ramda';

import { AbstractService } from '../core/AbstractService';

const defaultManaOceanSettings = {
  neutralManaLevel: 3,
  visibleMoonPeriod: 180, // minutes
  visibleMoonNewMoonTime: 0,
  visibleMoonManaTideHeight: 1,
  invisibleMoonPeriod: 270,
  invisibleMoonNewMoonTime: 120,
  invisibleMoonManaTideHeight: 1,
  moscowTime: 0,
};

export class ManaOceanSettingsService extends AbstractService {
  metadata = {
    actions: [
      'postManaOceanSettings',
      'postManaOceanSettingsConfirmed',
      'setManaOceanSettings',
    ],
    requests: [
      'manaOceanSettings',
    ],
    emitEvents: [
      'postManaOceanSettings',
      'postManaOceanSettingsRequested',
      'manaOceanSettingsChanged',
    ],
    listenEvents: [],
  };

  constructor() {
    super();
    this.manaOceanSettings = R.clone(defaultManaOceanSettings);
  }

  setData({ manaOceanSettings } = {}) {
    this.manaOceanSettings = manaOceanSettings || R.clone(defaultManaOceanSettings);
  }

  getData() {
    return {
      manaOceanSettings: this.getManaOceanSettings(),
    };
  }

  getManaOceanSettings() {
    return R.clone(this.manaOceanSettings);
  }

  setManaOceanSettings({ manaOceanSettings }) {
    const areEqual = R.equals(this.manaOceanSettings, manaOceanSettings);
    this.setData({ manaOceanSettings });
    if (!areEqual) {
      this.emit('manaOceanSettingsChanged', {
        manaOceanSettings,
      });
    }
  }

  postManaOceanSettings = ({ manaOceanSettings }) => {
    this.emit('postManaOceanSettingsRequested', { manaOceanSettings });
  }

  postManaOceanSettingsConfirmed({ manaOceanSettings }) {
    this.manaOceanSettings = R.clone(manaOceanSettings);
    // console.log('postBeaconRecord');
    this.emit('postManaOceanSettings', { manaOceanSettings });
  }
}
