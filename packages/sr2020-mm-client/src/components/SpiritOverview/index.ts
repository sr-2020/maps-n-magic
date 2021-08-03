import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { SpiritOverview } from './SpiritOverview';
import { withSpirits, withSpiritFractions, withSpiritRoutes } from '../../dataHOCs';

const tmp = pipe(
  withTranslation(), 
  withSpirits, 
  withSpiritFractions,
  withSpiritRoutes,
)(SpiritOverview);

export { tmp as SpiritOverview };