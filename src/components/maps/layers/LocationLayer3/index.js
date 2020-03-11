import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { LocationLayer3 } from './LocationLayer3.jsx';

const tmp = pipe(withTranslation())(LocationLayer3);

export { tmp as LocationLayer3 };
