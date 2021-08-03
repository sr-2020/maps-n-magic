import { 
  Metadata, 
  TypeOnly,
  Typed,
  ServiceContract,
  ServiceContractTypes
} from '../../core';

import { 
  UserRecord,
  RawUserRecord
} from "../../types";

// requests

export type GetUserRecords = (arg: TypeOnly<'userRecords'>) => UserRecord[];
export type GetUserRecord = (arg: Typed<'userRecord', {
  id: number;
}>) => UserRecord | undefined;

// actions

export type SetUserRecords = Typed<'setUserRecords', {
  userRecords: RawUserRecord[];
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

export interface UserRecordServiceContract extends ServiceContract {
  Request: GetUserRecords | GetUserRecord;
  Action: SetUserRecords;
  EmitEvent: UserRecordEvents;
  ListenEvent: never;
  NeedAction: never;
  NeedRequest: never;
}

export const urMetadata: ServiceContractTypes<UserRecordServiceContract> = {
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