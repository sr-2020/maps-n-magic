import { 
  Metadata, 
  TypeOnly,
  Typed,
} from '../../core';

import { 
  UserRecord
} from "../../types";

export const urMetadata: Metadata = {
  actions: [
    'setUserRecords',
    'reloadUserRecords',
  ],
  requests: ['userRecord', 'userRecords'],
  emitEvents: [
    'userRecordsChanged',
    'reloadUserRecords',
  ],
  listenEvents: [],
  needActions: [],
  needRequests: [],
};

// requests

export type GetUserRecords = (arg: TypeOnly<'userRecords'>) => UserRecord[];
export type GetUserRecord = (arg: Typed<'userRecord', {
  id: number;
}>) => UserRecord | undefined;

// actions

export type SetUserRecords = Typed<'setUserRecords', {
  userRecords: UserRecord[];
}>;
export type ReloadUserRecords = TypeOnly<'reloadUserRecords'>;

// events

export type EUserRecordsChanged = Typed<'userRecordsChanged', {
  userRecords: UserRecord[];
}>;
export type EReloadUserRecords = Typed<'reloadUserRecords'>;

export type UserRecordEvents = EUserRecordsChanged |
  EReloadUserRecords;