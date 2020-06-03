import * as R from 'ramda';

import { AbstractService } from '../core/AbstractService';

const arr = `1
1
Мистер X
9504
37232
Саша Терещенко
9542
37445
ЛеоЦарев
10853
51678
Rayen
10246
51656
van20011
10207
51635
Казаков
10206
51629
Марьяна
10203
51620
Ved
10312
44043
sluchajwe
10201
51617
Мэрфи
10200
51616
Girt
10199
51615
Schera
10198
51614
Алексей Еремин`.split('\n');

const userList = (R.map(R.zipObj(['userId', 'joinId', 'name']), R.splitEvery(3, arr)));
const userDict = R.indexBy(R.prop('userId'), userList);
// console.log(characterDict);

export class UserRecordService extends AbstractService {
  metadata = {
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
  };

  constructor() {
    super();
    this.userRecords = [];
  }

  setData({ userRecords } = {}) {
    this.userRecords = userRecords || [];
    this.userRecords.forEach((user) => {
      user.name = '';
      if (userDict[user.id]) {
        user.name = userDict[user.id].name;
      }
    });
  }

  getData() {
    return {
      userRecords: this.getUserRecords(),
    };
  }

  getUserRecords() {
    return [...this.userRecords];
  }

  getUserRecord({ id }) {
    const record = this.userRecords.find((br) => br.id === id);
    return R.clone(record);
  }

  setUserRecords({ userRecords }) {
    this.setData({ userRecords });
    this.emit('userRecordsChanged', {
      userRecords,
    });
  }

  reloadUserRecords() {
    this.emit('reloadUserRecords');
    // console.log('reloadUserRecords');
  }
}
