import { pipe } from 'ramda';
import { withTranslation } from 'react-i18next';
import { withLocationRecords, withGeoLocationRecords } from '../../dataHOCs';
import { GeoLocationSelectMap } from './GeoLocationSelectMap';

const tmp = pipe(
  withTranslation(), 
  withGeoLocationRecords,
  withLocationRecords,
)(GeoLocationSelectMap);

export { tmp as GeoLocationSelectMap };
