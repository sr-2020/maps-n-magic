import { pipe } from 'ramda';
import { withTrackedCharacterId, withUserRecords } from '../../dataHOCs';
import { withCharacterPosition } from '../../dataHOCs';
import { CharacterWatcher } from './CharacterWatcher';
import { withTranslation } from 'react-i18next';

const tmp = pipe(withTranslation(), withTrackedCharacterId, withUserRecords, withCharacterPosition)(CharacterWatcher);

export { tmp as CharacterWatcher };
