import { pipe } from 'ramda';
import { withTrackedCharacterId, withUserRecords } from '../../dataHOCs';
import { withCharacterPosition } from '../../dataHOCs';
import { CharacterWatcher } from './CharacterWatcher';

const tmp = pipe(withTrackedCharacterId, withUserRecords, withCharacterPosition)(CharacterWatcher);

export { tmp as CharacterWatcher };
