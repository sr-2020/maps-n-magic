import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { NavColumn } from './NavColumn';

const tmp = pipe(withTranslation())(NavColumn);

export { tmp as NavColumn };
