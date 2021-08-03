import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { SpiritFractionInput } from './SpiritFractionInput';
import { withSpiritFractions } from '../../../../dataHOCs';

const tmp = pipe(withTranslation(), withSpiritFractions)(SpiritFractionInput);

export { tmp as SpiritFractionInput };