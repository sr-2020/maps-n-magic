import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { LocationLayer4 } from './LocationLayer4.jsx';
import { withLocationRecords } from '../../dataHOCs/withLocationRecords.jsx';
// import { withLatLngBeacons } from './withLatLngBeacons.jsx';

const tmp = pipe(withTranslation(), withLocationRecords)(LocationLayer4);

export { tmp as LocationLayer4 };
