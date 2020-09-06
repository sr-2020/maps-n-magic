import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { CreateBeaconPopup } from './CreateBeaconPopup.jsx';

const tmp = pipe(withTranslation())(CreateBeaconPopup);

export { tmp as CreateBeaconPopup };
