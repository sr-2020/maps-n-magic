import {
  postSettings, 
  getSettings, 
} from './apiInterfaces';

import {  
  PostSettings,
  GetSettings,
} from "./types";

import {
  genericServerConstants
} from '../constants';

import { 
  ManaOceanEffectSettingsData,
  ManaOceanSettingsData,
  validateManaOceanSettingsData,
  validateManaOceanEffectSettingsData
} from 'sr2020-mm-event-engine';

import { validateEntityFunction } from '../types';

export class SettingsResourceProvider<T> implements PostSettings<T>, GetSettings<T> {
  constructor(public url: string, public validateSettings: validateEntityFunction<T>) {
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
    super(genericServerConstants().manaOceanConfigUrl, validateManaOceanSettingsData);
  }
}

export class ManaOceanEffectSettingsProvider extends SettingsResourceProvider<ManaOceanEffectSettingsData> {
  constructor() {
    super(genericServerConstants().manaOceanEffectConfigUrl, validateManaOceanEffectSettingsData);
  }
}