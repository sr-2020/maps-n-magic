import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { LocationPopup } from './LocationPopup.jsx';

const tmp = pipe(withTranslation())(LocationPopup);

export { tmp as LocationPopup };
