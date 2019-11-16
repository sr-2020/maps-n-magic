import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { MarkerPopup } from './MarkerPopup.jsx';

const tmp = pipe(withTranslation())(MarkerPopup);

export { tmp as MarkerPopup };
