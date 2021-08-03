import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { SpiritRouteTableRow } from './SpiritRouteTableRow';

const tmp = pipe(withTranslation())(SpiritRouteTableRow);

export { tmp as SpiritRouteTableRow };