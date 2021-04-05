import * as R from 'ramda';

import { 
  CharacterHealthStates, 
  CharacterHealthState,
  RawCharacterHealthState
} from 'sr2020-mm-event-engine';

export const charHealthIndexToList: (obj: CharacterHealthStates) => CharacterHealthState[] = R.pipe(
  R.toPairs, 
  // @ts-ignore
  R.map(([id, data2]: [number, RawCharacterHealthState]) => ({ 
    'characterId': Number(id), 
    ...data2 
  }))
);