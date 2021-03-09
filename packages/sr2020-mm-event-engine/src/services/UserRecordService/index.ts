import * as R from 'ramda';

import { 
  AbstractService, 
  Metadata, 
  GameModel, 
  GMLogger 
} from '../../core';

import {  } from "../../core/types";

import { UserRecord } from "../../types";

const arr: string[] = `37232
37232
Саша Терещенко
37445
37445
ЛеоЦарев
51678
51678
Rayen
51656
51656
van20011
51635
51635
Казаков
51629
51629
Марьяна
51620
51620
Ved
44043
44043
sluchajwe
51617
51617
Мэрфи
51616
51616
Girt
51615
51615
Schera
51614
51614
Алексей Еремин
51935
51935
NtsDK`.split('\n');

interface HardcodedUser {
  userId: string;
  joinId: string;
  name: string;
}

const userList: HardcodedUser[] = 
  (R.map(R.zipObj(['userId', 'joinId', 'name']), R.splitEvery(3, arr)));
const userDict: Record<string, HardcodedUser> = R.indexBy(R.prop('userId'), userList);

// console.log(characterDict);

const metadata: Metadata = {
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

export class UserRecordService extends AbstractService {
  userRecords: UserRecord[];

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(metadata);
    this.userRecords = [];
  }

  setData({ userRecords }: { userRecords: UserRecord[] } = { userRecords: [] }): void {
    // this.logger.info('userRecords', userRecords);
    this.userRecords = userRecords || [];
    this.userRecords.forEach((user) => {
      user.name = '';
      if (userDict[user.id] !== undefined) {
        user.name = userDict[user.id].name;
      }
    });
  }

  getData(): { userRecords: UserRecord[] } {
    return {
      userRecords: this.getUserRecords(),
    };
  }

  getUserRecords(): UserRecord[] {
    return [...this.userRecords];
  }

  getUserRecord({ id }: {id: number}): UserRecord | undefined {
    const record: UserRecord | undefined = this.userRecords.find((br) => br.id === id);
    return R.clone(record);
  }

  setUserRecords({ userRecords }: { userRecords: UserRecord[] }): void {
    this.setData({ userRecords });
    this.emit('userRecordsChanged', {
      type: 'userRecordsChanged',
      userRecords,
    });
  }

  reloadUserRecords(): void {
    this.emit('reloadUserRecords', {
      type: 'reloadUserRecords',
    });
    // console.log('reloadUserRecords');
  }
}
