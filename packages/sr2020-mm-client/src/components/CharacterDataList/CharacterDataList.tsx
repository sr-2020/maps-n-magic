import * as R from 'ramda';
import React from 'react';
import './CharacterDataList.css';

import { getUserNameStr, UserRecord } from 'sr2020-mm-event-engine';

interface CharacterDataListProps {
  users: UserRecord[]
};

export function CharacterDataList(props: CharacterDataListProps) {
  const { users } = props;

  if (!users) {
    return null;
  }

  const users2 = R.sortBy(R.prop('id'), users);

  // return null;

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
