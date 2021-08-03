import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { BeaconLayer4 } from './BeaconLayer4';
import { withBeaconRecords } from '../../dataHOCs';
import { withLatLngBeacons } from './withLatLngBeacons';

const tmp = pipe(withTranslation(), withLatLngBeacons, withBeaconRecords)(BeaconLayer4);

export { tmp as BeaconLayer4 };
