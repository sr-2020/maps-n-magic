import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { ManaOceanLayer2 } from './ManaOceanLayer2.jsx';

const tmp = pipe(withTranslation())(ManaOceanLayer2);

export { tmp as ManaOceanLayer2 };
