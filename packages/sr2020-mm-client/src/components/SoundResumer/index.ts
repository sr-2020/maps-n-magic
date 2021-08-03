import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { SoundResumer } from './SoundResumer';

const tmp = pipe(withTranslation())(SoundResumer);

export { tmp as SoundResumer };