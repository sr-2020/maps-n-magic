import { pipe } from 'ramda';
import { LoginPage } from './LoginPage';
import { withTranslation } from 'react-i18next';

const tmp = pipe(withTranslation())(LoginPage);

export { tmp as LoginPage };