import * as R from 'ramda';

import { AbstractService } from '../core/AbstractService';

// import { defaultManaOceanSettings } from '../api/constants';

export class SettingsService extends AbstractService {
  metadata = {
    actions: [
      'postSettings',
      'postSettingsConfirmed',
      'setSettings',
      'setSettingsCatalog',
    ],
    requests: [
      'settingsCatalog',
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
    this.settingsCatalog = {
      // manaOcean: R.clone(defaultManaOceanSettings),
    };
    // this.manaOceanSettings = R.clone(defaultManaOceanSettings);
  }

  setData({ settingsCatalog = {} }) {
    // try {
    //   throw new Error('1212');
    // } catch (e) {
    //   this.logger.info(e);
    // }
    // this.logger.info('SettingsService setData', settings);
    this.settingsCatalog = settingsCatalog || {
      // manaOcean: R.clone(defaultManaOceanSettings),
    };
    // this.manaOceanSettings = R.clone(defaultManaOceanSettings);
  }

  getData() {
    return {
      settingsCatalog: this.getSettingsCatalog(),
    };
  }

  getSettingsCatalog() {
    return R.clone(this.settingsCatalog);
  }

  setSettingsCatalog({ settingsCatalog }) {
    const prevSettingsCatalog = this.settingsCatalog;
    let list = [];
    if (R.is(Object, settingsCatalog)) {
      list = R.keys(settingsCatalog);
    }
    if (R.is(Object, prevSettingsCatalog)) {
      list = R.uniq([...list, ...R.keys(prevSettingsCatalog)]);
    }
    this.settingsCatalog = settingsCatalog;
    list.forEach((newKey) => {
      if (!R.equals(this.settingsCatalog[newKey], prevSettingsCatalog[newKey])) {
        this.emit('settingsChanged', {
          type: 'settingsChanged',
          name: newKey,
          settingsCatalog: this.settingsCatalog,
        });
      }
    });
  }

  getSettings({ name }) {
    // this.logger.info('getSettings', name, this.settingsCatalog);
    return R.clone(this.settingsCatalog[name]);
  }

  setSettings({ name, settings }) {
    // this.logger.info('setSettings', name, settings);
    const areEqual = R.equals(this.settingsCatalog[name], settings);
    this.setData({ settingsCatalog: { ...this.settingsCatalog, [name]: settings } });

    if (!areEqual) {
      this.emit('settingsChanged', {
        type: 'settingsChanged',
        name,
        settingsCatalog: this.settingsCatalog,
      });
    }
  }

  postSettings = (action) => {
    this.emit('postSettingsRequested', action);
  }

  postSettingsConfirmed({ name, settings }) {
    this.settingsCatalog = { ...this.settingsCatalog, [name]: settings };
    this.emit('postSettings', { name, settings });
    this.emit('settingsChanged', {
      type: 'settingsChanged',
      name,
      settingsCatalog: this.settingsCatalog,
    });
  }
}
