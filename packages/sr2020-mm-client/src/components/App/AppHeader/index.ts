import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { AppHeader } from './AppHeader';

const tmp = pipe(withTranslation())(AppHeader);

export { tmp as AppHeader };
