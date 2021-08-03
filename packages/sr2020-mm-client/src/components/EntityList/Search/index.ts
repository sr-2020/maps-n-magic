import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { Search } from './Search';

const tmp = pipe(withTranslation())(Search);

export { tmp as Search };
