// import { withTranslation } from 'react-i18next';
// import { withRouter } from 'react-router-dom';
import { pipe } from 'ramda';
import { SpiritList } from './SpiritList';

// const tmp = pipe(withRouter)(SpiritList);
const tmp = SpiritList;

export { tmp as SpiritList };