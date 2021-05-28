import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { SpiritNav } from './SpiritNav';

const tmp = pipe(withTranslation())(SpiritNav);

export { tmp as SpiritNav };
