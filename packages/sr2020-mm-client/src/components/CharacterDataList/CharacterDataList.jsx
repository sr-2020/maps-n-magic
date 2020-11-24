import * as R from 'ramda';
import React from 'react';
import './CharacterDataList.css';

import { getUserNameStr } from 'sr2020-mm-event-engine/utils';

export function CharacterDataList(props) {
  const { users } = props;

  if (!users) {
    return null;
  }

  const users2 = R.sortBy(R.prop('id'), users);

  return (
    <datalist className="CharacterDataList" id="characterIdList">
      {
        users2.map((user) => (
          <option
            key={user.id}
            value={user.id}
          >
            {user.id + getUserNameStr(user)}
          </option>
        ))
      }
    </datalist>
  );
}
