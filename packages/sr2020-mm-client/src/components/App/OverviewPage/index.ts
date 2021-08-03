import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { OverviewPage } from './OverviewPage';

const tmp = pipe(withTranslation())(OverviewPage);

export { tmp as OverviewPage };