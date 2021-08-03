import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { SpiritFractionList } from './SpiritFractionList';
import { withSpiritFractions } from '../../../dataHOCs';

const tmp = pipe(withTranslation(), withSpiritFractions)(SpiritFractionList);

export { tmp as SpiritFractionList };