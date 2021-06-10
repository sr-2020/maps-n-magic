import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { 
  withLocationRecords, 
  withSpirits, 
  withSpiritLocationData, 
  withGeoLocationRecords 
} from '../../dataHOCs';
import { SpiritLayer } from './SpiritLayer';

const tmp = pipe(
  withTranslation(),
  withSpiritLocationData,
  withGeoLocationRecords,
  withLocationRecords,
  withSpirits
)(SpiritLayer);

export { tmp as SpiritLayer };