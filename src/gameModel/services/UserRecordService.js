import * as R from 'ramda';

import { AbstractService } from '../core/AbstractService';

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
