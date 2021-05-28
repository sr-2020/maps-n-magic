import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { SpiritContent } from './SpiritContent';
import { withSpiritFractions } from '../../../dataHOCs';

const tmp = pipe(withTranslation(), withSpiritFractions)(SpiritContent);

export { tmp as SpiritContent };
