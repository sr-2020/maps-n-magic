import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { CharacterPositions } from './CharacterPositions';

const tmp = pipe(withTranslation())(CharacterPositions);

export { tmp as CharacterPositions };
