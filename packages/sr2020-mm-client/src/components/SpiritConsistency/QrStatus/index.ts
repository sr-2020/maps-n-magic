import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { QrStatus } from './QrStatus';

const tmp = pipe(withTranslation())(QrStatus);

export { tmp as QrStatus };