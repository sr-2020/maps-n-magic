import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { SpiritCatchers } from './SpiritCatchers';

const tmp = pipe(withTranslation())(SpiritCatchers);

export { tmp as SpiritCatchers };