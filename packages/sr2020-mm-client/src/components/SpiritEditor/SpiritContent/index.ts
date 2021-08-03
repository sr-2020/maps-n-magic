import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { SpiritContent } from './SpiritContent';
import { withSpiritRoutes } from '../../../dataHOCs';

const tmp = pipe(withTranslation(), withSpiritRoutes)(SpiritContent);

export { tmp as SpiritContent };
