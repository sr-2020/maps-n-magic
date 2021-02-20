import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { SoundRow } from './SoundRow';

const tmp = pipe(withTranslation())(SoundRow);

export { tmp as SoundRow };
