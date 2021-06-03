import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { SpiritStatusControl } from './SpiritStatusControl';

const tmp = pipe(withTranslation())(SpiritStatusControl);

export { tmp as SpiritStatusControl };