import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { InnerManaOceanLayer2 } from './InnerManaOceanLayer2.jsx';

const tmp = pipe(withTranslation())(InnerManaOceanLayer2);

export { tmp as InnerManaOceanLayer2 };
