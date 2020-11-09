import * as R from 'ramda';

import { AbstractService } from '../core/AbstractService';

const arr = `37232
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
