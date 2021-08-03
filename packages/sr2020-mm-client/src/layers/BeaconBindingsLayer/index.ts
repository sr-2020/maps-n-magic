import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { BeaconBindingsLayer } from './BeaconBindingsLayer';
import { 
  withBeaconBindingsData, 
  withBeaconRecords, 
  withGeoLocationRecords,
  withLocationRecords
} from '../../dataHOCs';

const tmp = pipe(
  withTranslation(), 
  withBeaconBindingsData,
  withBeaconRecords,
  withGeoLocationRecords,
  withLocationRecords 
)(BeaconBindingsLayer);

export { tmp as BeaconBindingsLayer };
