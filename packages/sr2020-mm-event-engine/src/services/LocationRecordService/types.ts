import { 
  AbstractService, 
  Metadata, 
  GameModel, 
  GMLogger,
  Typed,
  TypeOnly,
  Req,
  Res
} from '../../core';

import { 
  LocationRecord,
  TriangulationData
} from "../../types";

export const metadata: Metadata = {
  actions: [
    'postLocationRecord',
    'deleteLocationRecord',
    'putLocationRecord',
    'putLocationRecords',
    'postLocationRecordConfirmed',
    'deleteLocationRecordConfirmed',
    'putLocationRecordConfirmed',
    'putLocationRecordsConfirmed',
    'setLocationRecords',
  ],
  requests: [
    'locationRecord',
    'locationRecords',
    'triangulationData',
    'neighborOrRandomLocation',
    'neighborList',
  ],
  emitEvents: [
    'postLocationRecord',
    'deleteLocationRecord',
    'putLocationRecord',
    'putLocationRecords',
    'postLocationRecordRequested',
    'deleteLocationRecordRequested',
    'putLocationRecordRequested',
    'putLocationRecordsRequested',
    'locationRecordsChanged',
    'locationRecordsChanged2',
  ],
  listenEvents: [],
  needActions: [],
  needRequests: []
};

// requests

export type GetLocationRecords = (arg: TypeOnly<'locationRecords'>) => LocationRecord[];
export type GetLocationRecord = (arg: Typed<'locationRecord', {
  id: number
}>) => LocationRecord | null;
export type GetTriangulationData = (arg: TypeOnly<'triangulationData'>) => TriangulationData | null;
export type GetNeighborList = (arg: Typed<'neighborList', {
  locationId: number
}>) => LocationRecord[];
export type GetNeighborOrRandomLocation = (arg: Typed<'neighborOrRandomLocation', {
  locationId: number
}>) => LocationRecord | null;

// actions

// setLocationRecords({ locationRecords }: LocationRecordsObj): void 
// putLocationRecord(action: unknown): void {
// putLocationRecords(action: unknown): void {
// postLocationRecord = (action: unknown): void => {
// deleteLocationRecord = (action: unknown): void => {
// putLocationRecordConfirmed({ locationRecord }: LocationRecordObj): void 
// putLocationRecordsConfirmed({ locationRecords }: LocationRecordsObj): void 
// deleteLocationRecordConfirmed({ locationRecord }: LocationRecordObj): void 
// postLocationRecordConfirmed({ locationRecord }: LocationRecordObj): void 

// type LocationRecordsObj = {locationRecords: LocationRecord[]};
// type LocationRecordObj = {locationRecord: LocationRecord};
// type LocationIdObj = {locationId: number};

// export type PostSettingsArgs = {
//   name: 'manaOcean';
//   settings: ManaOceanSettingsData;
// } | {
//   name: 'manaOceanEffects';
//   settings: ManaOceanEffectSettingsData;
// };

// export type PostSettings = Typed<'postSettings', PostSettingsArgs>;
// export type PostSettingsConfirmed = Typed<'postSettingsConfirmed', PostSettingsArgs>;
// export type SetSettings = Typed<'setSettings', PostSettingsArgs>;
// export type SetSettingsCatalog = Typed<'setSettingsCatalog', {
//   settingsCatalog: SettingsCatalog
// }>;