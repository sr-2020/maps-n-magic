import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { LocationLayer2 } from './LocationLayer2.jsx';

const tmp = pipe(withTranslation())(LocationLayer2);

export { tmp as LocationLayer2 };
