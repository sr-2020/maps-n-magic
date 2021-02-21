import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { CreateBeaconPopover } from './CreateBeaconPopover';

const tmp = pipe(withTranslation())(CreateBeaconPopover);

export { tmp as CreateBeaconPopover };
