import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { ManaOceanSettings } from './ManaOceanSettings.jsx';

const tmp = pipe(withTranslation())(ManaOceanSettings);

export { tmp as ManaOceanSettings };
