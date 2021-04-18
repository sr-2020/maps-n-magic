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
  ],
  requests: ['userRecord', 'userRecords'],
  emitEvents: [
    'userRecordsChanged',
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

// events

export type EUserRecordsChanged = Typed<'userRecordsChanged', {
  userRecords: UserRecord[];
}>;

// This event relates to UserRecordService
// This service neither emits not not listen it.
// It is used only by API to force refresh user positions.
// See userRecordDataBinding declaration.
export type EReloadUserRecords = Typed<'reloadUserRecords'>;

export type UserRecordEvents = EUserRecordsChanged;