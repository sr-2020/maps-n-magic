import { pipe } from 'ramda';
import { withLoginState } from '../../dataHOCs';
import { AuthWrapper } from './AuthWrapper';
import { withTranslation } from 'react-i18next';

const tmp = pipe(withLoginState, withTranslation())(AuthWrapper);

export { tmp as AuthWrapper };