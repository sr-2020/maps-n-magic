import { pipe } from 'ramda';
import { withCharacterId, withUserRecords } from '../../dataHOCs';
import { withCharacterPosition } from '../../dataHOCs/withCharacterPosition';
import { CharacterWatcher } from './CharacterWatcher.jsx';

const tmp = pipe(withCharacterId, withUserRecords, withCharacterPosition)(CharacterWatcher);

export { tmp as CharacterWatcher };
