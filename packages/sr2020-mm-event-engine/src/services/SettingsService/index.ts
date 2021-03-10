import * as R from 'ramda';

import { 
  AbstractService, 
  Metadata, 
  GameModel, 
  GMLogger,
  Req,
  Res
} from '../../core';

import { SettingsCatalog, SettingsKeys, SettingsValues } from "../../types";

// import { defaultManaOceanSettings } from '../api/constants';

import { 
  metadata,
  GetSettingsCatalog,
  GetSettings,
  PostSettings,
  PostSettingsConfirmed,
  SetSettings,
  SetSettingsCatalog,
  SettingsEvents
} from "./types";

export class SettingsService extends AbstractService<SettingsEvents> {
  settingsCatalog: SettingsCatalog;

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
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

  // getData(): {settingsCatalog: SettingsCatalog} {
  //   return {
  //     settingsCatalog: this.getSettingsCatalog(),
  //   };
  // }

  getSettingsCatalog(arg: Req<GetSettingsCatalog>): Res<GetSettingsCatalog> {
    return R.clone(this.settingsCatalog);
  }

  setSettingsCatalog({ settingsCatalog }: SetSettingsCatalog): void {
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

  getSettings({ name }: Req<GetSettings>): Res<GetSettings> {
    // this.logger.info('getSettings', name, this.settingsCatalog);
    const value = this.settingsCatalog[name];
    return R.clone(value);
  }

  setSettings({ name, settings }: SetSettings): void {
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

  postSettings = (action: PostSettings): void => {
    this.emit2({
      ...action,
      type: 'postSettingsRequested'
    });
  }

  postSettingsConfirmed(action: PostSettingsConfirmed): void {
    const { name, settings } = action;
    this.settingsCatalog = { ...this.settingsCatalog, [name]: settings };
    this.emit2({ 
      ...action,
      type: 'postSettings'
    });
    this.emit2({
      type: 'settingsChanged',
      name,
      settingsCatalog: this.settingsCatalog,
    });
  }
}
