import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { LocateControlLayer } from './LocateControlLayer';

const tmp = pipe(withTranslation())(LocateControlLayer);

export { tmp as LocateControlLayer };