import { pipe } from 'ramda';
import { withLoginState, withAggregatedLocationData } from '../../hocs';
import { App } from './App';

const tmp = pipe(withLoginState, withAggregatedLocationData)(App);

export { tmp as App };
