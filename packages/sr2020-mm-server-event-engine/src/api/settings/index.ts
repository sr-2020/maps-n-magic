import {
  postSettings, 
  getSettings, 
} from './apiInterfaces';

import {  
  PostSettings,
  GetSettings,
} from "./types";

import {
  manaOceanConfigUrl,
  manaOceanEffectConfigUrl,
} from '../constants';

import { 
  ManaOceanEffectSettingsData,
  ManaOceanSettingsData
} from 'sr2020-mm-event-engine';

export class SettingsResourceProvider<T> implements PostSettings<T>, GetSettings<T> {
  constructor(public url: string) {
    return Object.assign(
      this,
      postSettings(this),
      getSettings(this),
    );
  }
  // all methods will be created by object assign
  get(): Promise<T> { throw new Error('Method not implemented.');}
  post(settings: T): Promise<T> {throw new Error('Method not implemented.');}
}

export class ManaOceanSettingsProvider extends SettingsResourceProvider<ManaOceanSettingsData> {
  constructor() {
    super(manaOceanConfigUrl);
  }
}

export class ManaOceanEffectSettingsProvider extends SettingsResourceProvider<ManaOceanEffectSettingsData> {
  constructor() {
    super(manaOceanEffectConfigUrl);
  }
}