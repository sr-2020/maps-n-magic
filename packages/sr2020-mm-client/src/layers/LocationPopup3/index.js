import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { LocationPopup3 } from './LocationPopup3.jsx';

const tmp = pipe(withTranslation())(LocationPopup3);

export { tmp as LocationPopup3 };
