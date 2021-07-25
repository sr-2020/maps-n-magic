import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { SpiritConsistency } from './SpiritConsistency';

const tmp = pipe(withTranslation())(SpiritConsistency);

export { tmp as SpiritConsistency };