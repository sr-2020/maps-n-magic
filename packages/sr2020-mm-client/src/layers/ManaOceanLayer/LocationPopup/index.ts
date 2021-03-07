import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { LocationPopup } from './LocationPopup';

const tmp = pipe(withTranslation())(LocationPopup);

export { tmp as LocationPopup };
