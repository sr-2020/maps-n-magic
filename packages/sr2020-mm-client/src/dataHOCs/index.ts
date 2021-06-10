import * as R from 'ramda';
import { 
  LocationRecord,
  BeaconRecord,
  UserRecord,
  Spirit,
  SpiritFraction,
  ManaOceanEffectSettingsData,
  ManaOceanSettingsData,
  BackgroundImage,
  EBeaconRecordsChanged2,
  ELocationRecordsChanged2,
  EUserRecordsChanged,
  EEnableManaOceanChanged,
  EEnableSpiritMovementChanged,
  Req,
  Res,
  ESpiritsChanged,
  ESpiritFractionsChanged,
  ESpiritRoutesChanged,
  SpiritRoute,
} from 'sr2020-mm-event-engine';

import { 
  EBackgroundImagesChange,
  ETrackedCharacterIdChanged,
  GetBackgroundImages,
} from "sr2020-mm-client-event-engine";

import { basicDataHOC } from './basicDataHOC';
// import { basicDataHOC2 } from './basicDataHOC2';
import { settingsDataHOC } from './settingsDataHOC';

export * from './withCharacterPosition';
export * from './withTriangulationData';
export * from './withCharacterHealthStatesForMap';
export * from './withCharacterHealthListForTable';
export * from './withCharacterIdHealthListForAudio';
export * from './withGeoLocationRecords';
export * from './withSpiritLocationData';

// links in HOC typing
// https://medium.com/@jrwebdev/react-higher-order-component-patterns-in-typescript-42278f7590fb
// https://stackoverflow.com/questions/43680786/writing-a-react-higher-order-component-with-typescript
// https://www.pluralsight.com/guides/higher-order-composition-typescript-react
// https://habr.com/ru/company/sberbank/blog/354104/
// https://dev.to/busypeoples/notes-on-typescript-pick-exclude-and-higher-order-components-40cp

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
export interface WithSpirits {
  spirits: Spirit[] | null;
}
export interface WithSpiritFractions {
  spiritFractions: SpiritFraction[] | null;
}
export interface WithSpiritRoutes {
  spiritRoutes: SpiritRoute[] | null;
}
export interface WithCharacterId {
  characterId: number | null;
}
export interface WithEnableSpiritMovement {
  enableSpiritMovement: boolean;
}

function sortBy(prop: string) {
  return function(value: any) {
    if (Array.isArray(value)) {
      return R.sortBy(R.prop(prop), value);
    }
    return value;
  }
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

export const withBackgroundImages = basicDataHOC<[], EBackgroundImagesChange>(
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
export const withBeaconRecords = basicDataHOC<[], EBeaconRecordsChanged2>(
  'beaconRecordsChanged2',
  'beaconRecords',
  [],
);
export const withLocationRecords = basicDataHOC<[], ELocationRecordsChanged2>(
  'locationRecordsChanged2',
  'locationRecords',
  [],
);
export const withUserRecords = basicDataHOC<[], EUserRecordsChanged>(
  'userRecordsChanged',
  'userRecords',
  [],
);

export const withSpirits = basicDataHOC<null, ESpiritsChanged>(
  'spiritsChanged',
  'spirits',
  null,
  sortBy('name')
);

export const withSpiritFractions = basicDataHOC<null, ESpiritFractionsChanged>(
  'spiritFractionsChanged',
  'spiritFractions',
  null,
  sortBy('id')
);

export const withSpiritRoutes = basicDataHOC<null, ESpiritRoutesChanged>(
  'spiritRoutesChanged',
  'spiritRoutes',
  null,
  sortBy('name')
);

export const withEnableManaOcean = basicDataHOC<true, EEnableManaOceanChanged>(
  'enableManaOceanChanged',
  'enableManaOcean',
  true,
);

export const withEnableSpiritMovement = basicDataHOC<true, EEnableSpiritMovementChanged>(
  'enableSpiritMovementChanged',
  'enableSpiritMovement',
  true,
);

export const withCharacterId = basicDataHOC<null, ETrackedCharacterIdChanged>(
  'trackedCharacterIdChanged',
  'characterId',
  null,
);

