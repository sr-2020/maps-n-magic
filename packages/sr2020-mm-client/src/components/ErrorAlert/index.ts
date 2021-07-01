import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { ErrorAlert } from './ErrorAlert';

const tmp = pipe(withTranslation())(ErrorAlert);

export { tmp as ErrorAlert };