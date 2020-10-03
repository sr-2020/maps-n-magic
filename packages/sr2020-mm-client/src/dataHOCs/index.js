import { basicDataHOC } from './basicDataHOC.jsx';

export const withManaOceanSettings = basicDataHOC(
  'manaOceanSettingsChanged',
  'manaOceanSettings',
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
export const withEnableManaOcean = basicDataHOC(
  'enableManaOceanChanged',
  'enableManaOcean',
  true,
);
