import { basicDataHOC } from './basicDataHOC.jsx';
import { settingsDataHOC } from './settingsDataHOC.jsx';

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
