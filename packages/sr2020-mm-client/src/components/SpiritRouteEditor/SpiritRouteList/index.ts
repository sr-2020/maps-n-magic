import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { SpiritRouteList } from './SpiritRouteList';
import { withSpiritRoutes } from '../../../dataHOCs';

const tmp = pipe(withSpiritRoutes, withTranslation())(SpiritRouteList);

export { tmp as SpiritRouteList };