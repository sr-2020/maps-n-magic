import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { BackgroundImagePopup } from './BackgroundImagePopup';

const tmp = pipe(withTranslation())(BackgroundImagePopup);

export { tmp as BackgroundImagePopup };
