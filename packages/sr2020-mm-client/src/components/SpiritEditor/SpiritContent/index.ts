import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { SpiritContent } from './SpiritContent';

const tmp = pipe(withTranslation())(SpiritContent);

export { tmp as SpiritContent };
