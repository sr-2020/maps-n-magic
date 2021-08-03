import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { SpiritNumberSelect } from './SpiritNumberSelect';

const tmp = pipe(withTranslation())(SpiritNumberSelect);

export { tmp as SpiritNumberSelect };