import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { SoundManager } from './SoundManager.jsx';

const tmp = pipe(withTranslation())(SoundManager);

export { tmp as SoundManager };
