import {
  postSettings, 
  getSettings, 
} from './apiInterfaces';

import {  
  PostSettings,
  GetSettings,
} from "./types";

import {
  mainServerConstants
} from '../constants';

import { 
  ManaOceanEffectSettingsData,
  ManaOceanSettingsData,
  validateManaOceanSettingsData,
  validateManaOceanEffectSettingsData
} from 'sr2020-mm-event-engine';

import { validateEntityFunction } from '../types';
import { SettingsResourceProvider } from '.';
import { manaOceanEffectSettings, manaOceanSettings } from '../../mockedData';

export class MockedSettingsResourceProvider<T> implements SettingsResourceProvider<T> {
  constructor(
    public settings: T
  ){}
  get(): Promise<T> {
    return Promise.resolve(this.settings);
  }
  post(settings: T): Promise<T> {
    this.settings = settings;
    return Promise.resolve(this.settings);
  }
}

export class MockedManaOceanSettingsProvider extends MockedSettingsResourceProvider<ManaOceanSettingsData> {
  constructor() {
    super(
      manaOceanSettings
    );
  }
}

export class MockedManaOceanEffectSettingsProvider extends MockedSettingsResourceProvider<ManaOceanEffectSettingsData> {
  constructor() {
    super(
      manaOceanEffectSettings
    );
  }
}