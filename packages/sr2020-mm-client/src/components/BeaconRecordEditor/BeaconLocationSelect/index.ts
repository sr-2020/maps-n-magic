import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { BeaconLocationSelect } from './BeaconLocationSelect';
import { withGeoLocationRecords, withLocationRecords } from '../../../dataHOCs';

const tmp = pipe(
  withTranslation(), 
  withGeoLocationRecords, 
  withLocationRecords
)(BeaconLocationSelect);

export { tmp as BeaconLocationSelect };