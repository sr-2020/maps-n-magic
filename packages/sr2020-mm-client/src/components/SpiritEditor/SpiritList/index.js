import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { SpiritList } from './SpiritList.jsx';

const tmp = pipe(withRouter, withTranslation())(SpiritList);

export { tmp as SpiritList };
