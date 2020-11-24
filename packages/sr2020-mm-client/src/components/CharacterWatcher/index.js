import { pipe } from 'ramda';
import { withCharacterId, withUserRecords } from '../../dataHOCs';
import { CharacterWatcher } from './CharacterWatcher.jsx';

const tmp = pipe(withCharacterId, withUserRecords)(CharacterWatcher);

export { tmp as CharacterWatcher };
