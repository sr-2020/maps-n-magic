import * as R from 'ramda';

import { AbstractService } from '../core/AbstractService';

import { defaultManaOceanSettings } from '../api/constants';

export class SettingsService extends AbstractService {
  metadata = {
    actions: [
      'postSettings',
      'postSettingsConfirmed',
      'setSettings',
    ],
    requests: [
      'allSettings',
      'settings',
    ],
    emitEvents: [
      'postSettings',
      'postSettingsRequested',
      'settingsChanged',
    ],
    listenEvents: [],
  };

  constructor(...args) {
    super(...args);
    this.settings = {
      manaOcean: R.clone(defaultManaOceanSettings),
    };
    // this.manaOceanSettings = R.clone(defaultManaOceanSettings);
  }

  setData({ settings = {} }) {
    try {
      throw new Error('1212');
    } catch (e) {
      this.logger.info(e);
    }
    this.logger.info('SettingsService setData', settings);
    this.settings = settings || {
    // this.settings = {
      manaOcean: R.clone(defaultManaOceanSettings),
    };
    // this.manaOceanSettings = R.clone(defaultManaOceanSettings);
  }

  getData() {
    return {
      settings: this.getAllSettings(),
    };
  }

  getAllSettings() {
    return R.clone(this.settings);
  }

  getSettings({ name }) {
    this.logger.info('getSettings', name, this.settings);
    return R.clone(this.settings[name]);
  }

  setSettings({ name, settings }) {
    const areEqual = R.equals(this.settings[name], settings);
    this.setData({ settings: { ...this.settings, [name]: settings } });
    if (!areEqual) {
      this.emit('settingsChanged', {
        type: 'settingsChanged',
        name,
        settings: this.settings,
      });
    }
  }

  postSettings = (action) => {
    this.emit('postSettingsRequested', action);
  }

  postSettingsConfirmed({ name, settings }) {
    this.settings = { ...this.settings, [name]: settings };
    this.emit('postSettings', { name, settings });
    this.emit('settingsChanged', {
      type: 'settingsChanged',
      name,
      settings: this.settings,
    });
  }
}
