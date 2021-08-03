import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { BeaconRecordEditor } from './BeaconRecordEditor';
import { withSortDataHOC } from './SortDataHOC';
import { withBeaconRecords, withLocationRecords, withGeoLocationRecords } from '../../dataHOCs';

const tmp = pipe(
  withTranslation(),
  withSortDataHOC,
  withBeaconRecords,
  withLocationRecords,
)(BeaconRecordEditor);

export { tmp as BeaconRecordEditor };
