import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { CharacterLogs } from './CharacterLogs';

const tmp = pipe(withTranslation())(CharacterLogs);

export { tmp as CharacterLogs };