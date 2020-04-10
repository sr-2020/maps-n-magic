import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { BeaconLayer3 } from './BeaconLayer3.jsx';

const tmp = pipe(withTranslation())(BeaconLayer3);

export { tmp as BeaconLayer3 };
