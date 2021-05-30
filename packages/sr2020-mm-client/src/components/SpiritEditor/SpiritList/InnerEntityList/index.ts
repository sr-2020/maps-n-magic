import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { InnerEntityList } from './InnerEntityList';

const tmp = pipe(withTranslation())(InnerEntityList);

export { tmp as InnerEntityList };