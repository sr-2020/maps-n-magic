import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { SpiritFractionEditor } from './SpiritFractionEditor';

const tmp = pipe(withTranslation())(SpiritFractionEditor);

export { tmp as SpiritFractionEditor };