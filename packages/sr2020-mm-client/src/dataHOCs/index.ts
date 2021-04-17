import { 
  LocationRecord,
  BeaconRecord,
  UserRecord,
  ManaOceanEffectSettingsData,
  ManaOceanSettingsData,
  BackgroundImage,
  EBeaconRecordsChanged2,
  ELocationRecordsChanged2,
  EUserRecordsChanged,
  EEnableManaOceanChanged,
  Req,
  Res
} from 'sr2020-mm-event-engine';

import { 
  EBackgroundImagesChange,
  ETrackedCharacterIdChanged,
  GetBackgroundImages,
} from "sr2020-mm-client-event-engine";

import { basicDataHOC } from './basicDataHOC';
import { basicDataHOC2 } from './basicDataHOC2';
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

// // type StringTypeOnly<T extends (type: string | {type: string}) => any> = (type: string) => U;
// type StringTypeOnly<
//   T extends (type: string | {type: string}) => any, 
//   In = Req<T>,
//   Out = Res<T>
// > = (type: Exclude<In, {type: string}>) => Out;

// // type f = StringTypeOnly<GetBackgroundImages>;

// export const withBackgroundImages = basicDataHOC2<
//   BackgroundImage[],
//   StringTypeOnly<GetBackgroundImages>,
//   'backgroundImagesChanged'
//   // EBackgroundImagesChange
// >(
//   'backgroundImagesChanged',
//   'backgroundImages',
// );
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
  'trackedCharacterIdChanged',
  'characterId',
  true,
);
