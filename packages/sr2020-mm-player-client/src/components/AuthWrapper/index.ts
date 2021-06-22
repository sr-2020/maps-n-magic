import { pipe } from 'ramda';
import { withLoginState } from '../../hocs';
import { AuthWrapper } from './AuthWrapper';

const tmp = pipe(withLoginState)(AuthWrapper);

export { tmp as AuthWrapper };