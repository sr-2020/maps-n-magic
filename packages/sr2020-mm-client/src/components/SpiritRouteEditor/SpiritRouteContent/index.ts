import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { SpiritRouteContent } from './SpiritRouteContent';

const tmp = pipe(withTranslation())(SpiritRouteContent);

export { tmp as SpiritRouteContent };