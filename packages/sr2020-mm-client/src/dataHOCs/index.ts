import { 
  LocationRecord,
  BeaconRecord,
  UserRecord,
  ManaOceanEffectSettingsData,
  ManaOceanSettingsData,
  BackgroundImage
} from 'sr2020-mm-event-engine';

import { basicDataHOC } from './basicDataHOC';
import { settingsDataHOC } from './settingsDataHOC';

export * from './withCharacterPosition';
export * from './withTriangulationData';
export * from './withCharacterHealthStatesForMap';
export * from './withCharacterHealthListForTable';
export * from './withCharacterIdHealthListForAudio';

export interface WithManaOceanSettings {
  manaOcean: ManaOceanSettingsData;
}
export interface WithManaOceanEffectSettings {
  manaOceanEffects: ManaOceanEffectSettingsData;
}

export interface WithBackgroundImages {
  backgroundImages: BackgroundImage[];
}
export interface WithLocationRecords {
  locationRecords: LocationRecord[];
}
export interface WithBeaconRecords {
  beaconRecords: BeaconRecord[];
}
export interface WithUserRecords {
  userRecords: UserRecord[];
}


export const withManaOceanSettings = settingsDataHOC(
  'settingsChanged',
  'manaOcean',
  {},
);
export const withManaOceanEffectSettings = settingsDataHOC(
  'settingsChanged',
  'manaOceanEffects',
  {},
);
export const withBackgroundImages = basicDataHOC(
  'backgroundImagesChanged',
  'backgroundImages',
  [],
);
export const withBeaconRecords = basicDataHOC(
  'beaconRecordsChanged2',
  'beaconRecords',
  [],
);
export const withLocationRecords = basicDataHOC(
  'locationRecordsChanged2',
  'locationRecords',
  [],
);
export const withUserRecords = basicDataHOC(
  'userRecordsChanged',
  'userRecords',
  [],
);
export const withEnableManaOcean = basicDataHOC(
  'enableManaOceanChanged',
  'enableManaOcean',
  true,
);
export const withCharacterId = basicDataHOC(
  'characterIdChanged',
  'characterId',
  true,
);
