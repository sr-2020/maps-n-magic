import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { EntityList } from './EntityList';

const tmp = pipe(withTranslation())(EntityList);

export { tmp as EntityList };