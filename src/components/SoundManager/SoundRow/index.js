import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { SoundRow } from './SoundRow.jsx';

const tmp = pipe(withTranslation())(SoundRow);

export { tmp as SoundRow };
