import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { InnerEntityRoutes } from './InnerEntityRoutes';

const tmp = pipe(withTranslation())(InnerEntityRoutes);

export { tmp as InnerEntityRoutes };