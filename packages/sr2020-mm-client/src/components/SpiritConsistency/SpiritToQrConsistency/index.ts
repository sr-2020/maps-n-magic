import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { SpiritToQrConsistency } from './SpiritToQrConsistency';

const tmp = pipe(withTranslation())(SpiritToQrConsistency);

export { tmp as SpiritToQrConsistency };