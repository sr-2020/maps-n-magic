import { pipe } from 'ramda';
import { withCharacterId, withUserRecords } from '../../dataHOCs';
import { withCharacterPosition } from '../../dataHOCs';
import { CharacterWatcher } from './CharacterWatcher';

const tmp = pipe(withCharacterId, withUserRecords, withCharacterPosition)(CharacterWatcher);

export { tmp as CharacterWatcher };
