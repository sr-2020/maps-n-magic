import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { SpiritFractionContent } from './SpiritFractionContent';

const tmp = pipe(withTranslation())(SpiritFractionContent);

export { tmp as SpiritFractionContent };