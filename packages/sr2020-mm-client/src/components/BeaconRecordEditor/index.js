import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { BeaconRecordEditor } from './BeaconRecordEditor.jsx';
import { withSortDataHOC } from './SortDataHOC.jsx';
import { withBeaconRecords, withLocationRecords } from '../../dataHOCs';

const tmp = pipe(
  withTranslation(),
  withSortDataHOC,
  withBeaconRecords,
  withLocationRecords,
)(BeaconRecordEditor);

export { tmp as BeaconRecordEditor };
