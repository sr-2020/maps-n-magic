import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { NavList } from './NavList.jsx';

const tmp = pipe(withTranslation())(NavList);

export { tmp as NavList };
