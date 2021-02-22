import * as R from 'ramda';

import { AbstractService } from '../core/AbstractService';

import { Metadata } from "../core/types";

import { UserRecord, SettingsCatalog, SettingsKeys, SettingsValues } from "../types";


// import { defaultManaOceanSettings } from '../api/constants';

const metadata: Metadata = {
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
  needActions: [],
  needRequests: [],
};

export class SettingsService extends AbstractService {
  settingsCatalog: SettingsCatalog;

  constructor() {
    super();
    this.setMetadata(metadata);
    this.settingsCatalog = {
      // manaOcean: R.clone(defaultManaOceanSettings),
    };
    // this.manaOceanSettings = R.clone(defaultManaOceanSettings);
  }

  setData({ settingsCatalog = {} } : {settingsCatalog: SettingsCatalog}): void {
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

  getData(): {settingsCatalog: SettingsCatalog} {
    return {
      settingsCatalog: this.getSettingsCatalog(),
    };
  }

  getSettingsCatalog(): SettingsCatalog {
    return R.clone(this.settingsCatalog);
  }

  setSettingsCatalog({ settingsCatalog }: {settingsCatalog: SettingsCatalog}): void {
    const prevSettingsCatalog = this.settingsCatalog;
    let list: SettingsKeys[] = [];
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

  getSettings({ name }: { name: SettingsKeys }) {
    // this.logger.info('getSettings', name, this.settingsCatalog);
    return R.clone(this.settingsCatalog[name]);
  }

  setSettings({ name, settings }: { name: SettingsKeys, settings: SettingsValues }): void {
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

  postSettings = (action): void => {
    this.emit('postSettingsRequested', action);
  }

  postSettingsConfirmed({ name, settings }: { name: SettingsKeys, settings: SettingsValues }): void {
    this.settingsCatalog = { ...this.settingsCatalog, [name]: settings };
    this.emit('postSettings', { name, settings });
    this.emit('settingsChanged', {
      type: 'settingsChanged',
      name,
      settingsCatalog: this.settingsCatalog,
    });
  }
}
