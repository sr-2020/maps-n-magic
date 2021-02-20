import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { SoundManager } from './SoundManager';

const tmp = pipe(withTranslation())(SoundManager);

export { tmp as SoundManager };
