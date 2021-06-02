import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { SpiritRouteTable } from './SpiritRouteTable';

const tmp = pipe(withTranslation())(SpiritRouteTable);

export { tmp as SpiritRouteTable };