import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { BeaconLayer4 } from './BeaconLayer4.jsx';
import { withBeaconRecords } from '../../dataHOCs/withBeaconRecords.jsx';
import { withLatLngBeacons } from './withLatLngBeacons.jsx';

const tmp = pipe(withTranslation(), withLatLngBeacons, withBeaconRecords)(BeaconLayer4);

export { tmp as BeaconLayer4 };
