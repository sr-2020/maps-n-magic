import { pipe } from 'ramda';
import { withLoginState } from '../../hocs';
import { App } from './App';

const tmp = pipe(withLoginState)(App);

export { tmp as App };
