import * as R from 'ramda';

import { 
  AbstractService, 
  Metadata, 
  GameModel, 
  GMLogger,
  Req,
  Res
} from '../../core';

import { UserRecord } from "../../types";

import { 
  urMetadata,
  GetUserRecord,
  GetUserRecords,
  SetUserRecords,
  UserRecordEvents,
  UserRecordServiceContract
} from "./types";

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

export class UserRecordService extends AbstractService<UserRecordServiceContract> {
  userRecords: UserRecord[];

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(urMetadata);
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

  // getData(): { userRecords: UserRecord[] } {
  //   return {
  //     userRecords: this.getUserRecords(),
  //   };
  // }

  getUserRecords(arg: Req<GetUserRecords>): Res<GetUserRecords> {
    return [...this.userRecords];
  }

  getUserRecord({ id }: Req<GetUserRecord>): Res<GetUserRecord> {
    const record: UserRecord | undefined = this.userRecords.find((br) => br.id === id);
    return R.clone(record);
  }

  setUserRecords({ userRecords }: SetUserRecords): void {
    this.setData({ userRecords });
    this.emit2({
      type: 'userRecordsChanged',
      userRecords,
    });
  }
}
