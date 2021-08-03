import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { SpiritList } from './SpiritList';
import { withSpirits, withSpiritFractions } from '../../../dataHOCs';

const tmp = pipe(withRouter, withTranslation(), withSpirits, withSpiritFractions)(SpiritList);

export { tmp as SpiritList };
