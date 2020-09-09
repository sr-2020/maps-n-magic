import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { App } from './App.jsx';

const tmp = pipe(withTranslation())(App);

export { tmp as App };
